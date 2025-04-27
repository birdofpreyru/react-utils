/**
 * ExpressJS middleware for server-side rendering of a ReactJS app.
 */

import fs from 'fs';
import path from 'path';

import type { Request, RequestHandler } from 'express';
import type { ComponentType } from 'react';
import { Writable } from 'stream';
import { brotliCompress, brotliDecompress } from 'zlib';
import winston from 'winston';

import { GlobalStateProvider, SsrContext } from '@dr.pogodin/react-global-state';
import { timer } from '@dr.pogodin/js-utils';

import {
  clone,
  cloneDeep,
  defaults,
  isString,
  get,
  mapValues,
  omit,
} from 'lodash';

import config from 'config';
import forge from 'node-forge';

import { prerenderToNodeStream } from 'react-dom/static';
import { HelmetProvider, type HelmetDataContext } from '@dr.pogodin/react-helmet';
import { StaticRouter } from 'react-router';
import serializeJs from 'serialize-javascript';
import { type BuildInfoT, setBuildInfo } from 'utils/isomorphy/buildInfo';

import type { ChunkGroupsT, SsrContextT } from 'utils/globalState';

import type { Configuration, Stats } from 'webpack';

import Cache from './Cache';

const sanitizedConfig = omit(config, 'SECRET');

// Note: These type definitions for logger are copied from Winston logger,
// then simplified to make it easier to fit an alternative logger into this
// interface.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface LogMethodI {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  (level: string, message: string, ...meta: unknown[]): void;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface LeveledLogMethodI {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  (message: string, ...meta: unknown[]): void;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface LoggerI {
  debug: LeveledLogMethodI;
  error: LeveledLogMethodI;
  info: LeveledLogMethodI;
  log: LogMethodI;
  warn: LeveledLogMethodI;
}

export enum SCRIPT_LOCATIONS {
  BODY_OPEN = 'BODY_OPEN',
  DEFAULT = 'DEFAULT',
  HEAD_OPEN = 'HEAD_OPEN',
}

export class ServerSsrContext<StateT>
  extends SsrContext<StateT>
  implements SsrContextT<StateT> {
  chunkGroups: ChunkGroupsT;

  chunks: string[] = [];

  req: Request;

  status: number = 200;

  constructor(
    req: Request,
    chunkGroups: ChunkGroupsT,
    initialState?: StateT,
  ) {
    super(cloneDeep(initialState) ?? ({} as StateT));
    this.chunkGroups = chunkGroups;
    this.req = req;
  }
}

type ScriptT = {
  code: string;
  location: SCRIPT_LOCATIONS;
};

/**
 * Reads build-time information about the app. This information is generated
 * by our standard Webpack config for apps, and it is written into
 * ".build-info" file in the context folder specified in Webpack config.
 * At the moment, that file contains build timestamp and a random 32-bit key,
 * suitable for cryptographical use.
 * @param context Webpack context path used during the build.
 * @return Resolves to the build-time information.
 */
function getBuildInfo(context: string) {
  const url = path.resolve(context, '.build-info');
  return JSON.parse(fs.readFileSync(url, 'utf8')) as BuildInfoT;
}

/**
 * Attempts to read from disk the named chunk groups mapping generated
 * by Webpack during the compilation.
 * It will not work for development builds, where these stats should be captured
 * via compilator callback.
 * @param buildDir
 * @return
 */
function readChunkGroupsJson(buildDir: string) {
  const url = path.resolve(buildDir, '__chunk_groups__.json');
  let res;
  try {
    res = JSON.parse(fs.readFileSync(url, 'utf8')) as Record<string, string[]>;
  } catch {
    // TODO: Should we message the error here somehow?
    res = null;
  }
  return res;
}

/**
 * Prepares a new Cipher for data encryption.
 * @param key Encryption key (32-bit random key is expected, see
 *  node-forge documentation, in case of doubts).
 * @return Resolves to the object with two fields:
 *  1. cipher - a new Cipher, ready for encryption;
 *  2. iv - initial vector used by the cipher.
 */
async function prepareCipher(key: string): Promise<{
  cipher: forge.cipher.BlockCipher;
  iv: string;
}> {
  return new Promise((resolve, reject) => {
    forge.random.getBytes(32, (err, iv) => {
      if (err) reject(err);
      else {
        const cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({ iv });
        resolve({ cipher, iv });
      }
    });
  });
}

/**
 * Given an incoming HTTP requests, it deduces whether Brotli-encoded responses
 * are acceptable to the caller.
 * @param req
 */
export function isBrotliAcceptable(req: Request): boolean {
  const acceptable = req.get('accept-encoding');
  if (acceptable) {
    const ops = acceptable.split(',');
    for (const op of ops) {
      const [type, priority] = op.trim().split(';q=');
      if ((type === '*' || type === 'br')
        && (!priority || parseFloat(priority) > 0)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Given an array of extra script strings / objects, it returns an object with
 * arrays of scripts to inject in different HTML template locations. During
 * the script groupping it also filters out any empty scripts.
 * @param {({
 *  code: string;
 *  location: string;
 * }|string)[]} [scripts=[]]
 * @return {{
 *  BODY_OPEN: string[];
 *  DEFAULT: string[];
 *  HEAD_OPEN: string[];
 * }}
 */
function groupExtraScripts(scripts: Array<string | ScriptT> = []) {
  const res = {
    [SCRIPT_LOCATIONS.BODY_OPEN]: '',
    [SCRIPT_LOCATIONS.DEFAULT]: '',
    [SCRIPT_LOCATIONS.HEAD_OPEN]: '',
  };
  for (const script of scripts) {
    if (isString(script)) {
      if (script) res[SCRIPT_LOCATIONS.DEFAULT] += script;
    } else if (script.code) {
      if (script.location in res) res[script.location] += script.code;
      else throw Error(`Invalid location "${script.location}"`);
    }
  }
  return res;
}

/**
 * Creates a new default (Winston) logger.
 * @param {object} [options={}]
 * @param {string} [options.defaultLogLevel='info']
 * @return {object}
 */
export function newDefaultLogger({
  defaultLogLevel = 'info',
} = {}): winston.Logger {
  const { format, transports } = winston;
  return winston.createLogger({
    format: format.combine(
      format.splat(),
      format.timestamp(),
      format.colorize(),
      format.printf(
        ({
          level,
          message,
          timestamp,
          stack,
          ...rest
        }) => {
          let res = `${level}\t(at ${timestamp as string}):\t${message as string}`;
          if (Object.keys(rest).length) {
            res += `\n${JSON.stringify(rest, null, 2)}`;
          }
          if (stack) res += `\n${stack as string}`;
          return res;
        },
      ),
    ),
    level: defaultLogLevel,
    transports: [new transports.Console()],
  });
}

export type ConfigT = {
  [key: string]: ConfigT | string;
};

export type BeforeRenderResT = {
  configToInject?: ConfigT;
  extraScripts?: Array<ScriptT | string>;
  initialState?: unknown;
};

export type BeforeRenderT =
(req: Request, config: ConfigT) => BeforeRenderResT | Promise<BeforeRenderResT>;

type CacheRefT = {
  key: string;
  maxage?: number;
};

export type OptionsT = {
  Application?: ComponentType;
  beforeRender?: BeforeRenderT;
  buildInfo?: BuildInfoT;
  defaultLoggerLogLevel?: string;
  favicon?: string;
  logger?: LoggerI;
  maxSsrRounds?: number;
  noCsp?: boolean;
  staticCacheSize?: number;
  ssrTimeout?: number;
  staticCacheController?: (req: Request) => CacheRefT | null | undefined;
};

/**
 * Creates the middleware.
 * @param webpackConfig
 * @param options Additional options:
 * @param [options.Application] The root ReactJS component of
 * the app to use for the server-side rendering. When not provided
 * the server-side rendering is disabled.
 * @param [options.buildInfo] "Build info" object to use. If provided,
 *  it will be used, instead of trying to load from the filesystem the one
 *  generated by the Webpack build. It is intended for test environments,
 *  where passing this stuff via file system is no bueno.
 * @param [options.favicon] `true` will include favicon
 *  link into the rendered HTML templates.
 * @param [options.noCsp] `true` means that no
 * Content-Security-Policy (CSP) is used by server, thus the renderer
 * may cut a few corners.
 * @param [options.maxSsrRounds=10] Maximum number of SSR rounds.
 * @param [options.ssrTimeout=1000] SSR timeout in milliseconds,
 * defaults to 1 second.
 * @param [options.staticCacheSize=1.e7] The maximum
 * static cache size in bytes. Defaults to ~10 MB.
 * @param [options.staticCacheController] When given, it activates,
 * and controls the static caching of generated HTML markup. When this function
 * is provided, on each incoming request it is triggered with the request
 * passed in as the argument. To attempt to serve the response from the cache
 * it should return the object with the following fields:
 * - `key: string` &ndash; the cache key for the response;
 * - `maxage?: number` &ndash; the maximum age of cached result in ms.
 *   If undefined - infinite age is assumed.
 * @return Created middleware.
 */
export default function factory(
  webpackConfig: Configuration,
  options: OptionsT,
): RequestHandler {
  const ops: OptionsT = defaults(clone(options), {
    beforeRender: async () => Promise.resolve({}),
    maxSsrRounds: 10,
    ssrTimeout: 1000,
    staticCacheSize: 1.e7,
  });

  // Note: in normal use the default logger is created and set in the root
  // server function, and this initialization is for testing uses, where
  // renderer is imported directly.
  ops.logger ??= newDefaultLogger({
    defaultLogLevel: ops.defaultLoggerLogLevel,
  });

  const buildInfo = ops.buildInfo ?? getBuildInfo(webpackConfig.context!);
  setBuildInfo(buildInfo);

  // publicPath from webpack.output has a trailing slash at the end.
  const { publicPath, path: outputPath } = webpackConfig.output!;

  const manifestLink = fs.existsSync(`${outputPath}/manifest.json`)
    ? `<link rel="manifest" href="${publicPath as string}manifest.json">` : '';

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface BufferWithNonce extends Buffer {
    nonce: string;
  }

  const cache = ops.staticCacheController
    ? new Cache<{
      buffer: BufferWithNonce;
      status: number;
    }>(ops.staticCacheSize!)
    : null;

  const CHUNK_GROUPS = readChunkGroupsJson(outputPath!);

  // TODO: Look at it later.
  // eslint-disable-next-line complexity
  return async (req, res, next) => {
    try {
      // Ensures any caches always revalidate HTML markup before reuse.
      res.set('Cache-Control', 'no-cache');

      res.cookie('csrfToken', req.csrfToken());

      let cacheRef: CacheRefT | null | undefined;
      if (cache) {
        cacheRef = ops.staticCacheController!(req);
        if (cacheRef) {
          const data = cache.get(cacheRef);
          if (data !== null) {
            const { buffer, status } = data;
            if (ops.noCsp && isBrotliAcceptable(req)) {
              res.set('Content-Type', 'text/html');
              res.set('Content-Encoding', 'br');
              if (status !== 200) res.status(status);
              res.send(buffer);
            } else {
              await new Promise<void>((done, failed) => {
                brotliDecompress(buffer, (error, html) => {
                  if (error) failed(error);
                  else {
                    let h = html.toString();
                    if (!ops.noCsp) {
                      // TODO: Starting from Node v15 we'll be able to use string's
                      // .replaceAll() method instead relying on reg. expression for
                      // global matching.
                      const regex = new RegExp(buffer.nonce, 'g');

                      // TODO: It should be implemented more careful.
                      h = h.replace(regex, (req as unknown as {
                        nonce: string;
                      }).nonce);
                    }
                    if (status !== 200) res.status(status);
                    res.send(h);
                    done();
                  }
                });
              });
            }
            return;
          }
        }
      }

      const [{
        configToInject,
        extraScripts,
        initialState,
      }, {
        cipher,
        iv,
      }] = await Promise.all([
        ops.beforeRender!(req, sanitizedConfig as unknown as ConfigT),
        prepareCipher(buildInfo.key),
      ]);

      let helmet: HelmetDataContext['helmet'];

      // Gets the mapping between code chunk names and their asset files.
      // These data come from the Webpack compilation, either from the stats
      // attached to the request (in dev mode), or from a file output during
      // the build (in prod mode).
      let chunkGroups: ChunkGroupsT;
      const webpackStats = get(res.locals, 'webpack.devMiddleware.stats') as Stats | undefined;
      if (webpackStats) {
        chunkGroups = mapValues(
          webpackStats.toJson({
            all: false,
            chunkGroups: true,
          }).namedChunkGroups,
          (item) => item.assets?.map(({ name }: { name: string }) => name)
            ?? [],
        );
      } else if (CHUNK_GROUPS) chunkGroups = CHUNK_GROUPS;
      else chunkGroups = {};

      /* Optional server-side rendering. */
      const App = ops.Application;
      let appHtmlMarkup: string = '';
      const ssrContext = new ServerSsrContext(req, chunkGroups, initialState);
      let stream: NodeJS.ReadableStream;
      if (App) {
        const ssrStart = Date.now();

        // TODO: Somehow, without it TS does not realise that
        // App has been checked to exist.
        const App2 = App;

        const renderPass = async () => {
          ssrContext.chunks = [];

          // TODO: prerenderToNodeStream has (abort) "signal" option,
          // and we should wire it up to the SSR timeout below.
          const helmetContext = {} as HelmetDataContext;
          const { prelude } = await prerenderToNodeStream(
            <GlobalStateProvider
              initialState={ssrContext.state}
              ssrContext={ssrContext}
            >
              <StaticRouter location={req.url}>
                <HelmetProvider context={helmetContext}>
                  <App2 />
                </HelmetProvider>
              </StaticRouter>
            </GlobalStateProvider>,
            { onError: (error) => {
              throw error;
            } },
          );
          ({ helmet } = helmetContext);

          return prelude;
        };

        let ssrRound = 0;
        let bailed = false;
        for (; ssrRound < ops.maxSsrRounds!; ++ssrRound) {
          stream = await renderPass();

          if (!ssrContext.dirty) break;

          const timeout = ops.ssrTimeout! + ssrStart - Date.now();
          bailed = timeout <= 0 || !await Promise.race([
            Promise.allSettled(ssrContext.pending),
            timer(timeout).then(() => false),
          ]);
          if (bailed) break;
        }

        let logMsg;
        if (ssrContext.dirty) {
          // NOTE: In the case of incomplete SSR one more round is necessary
          // to ensure the correct hydration when some pending promises have
          // resolved and placed their data into the initial global state.
          stream = await renderPass();

          logMsg = bailed ? `SSR timed out after ${ops.ssrTimeout} second(s)`
            : `SSR bailed out after ${ops.maxSsrRounds} round(s)`;
        } else logMsg = `SSR completed in ${ssrRound + 1} round(s)`;

        ops.logger!.log(ssrContext.dirty ? 'warn' : 'info', logMsg);

        await new Promise((ready) => {
          stream!.pipe(new Writable({
            destroy: ready,
            write: (chunk: { toString: () => string }, _, done) => {
              appHtmlMarkup += chunk.toString();
              done();
            },
          }));
        });
      }

      /* Encrypts data to be injected into HTML.
       * Keep in mind, that this encryption is no way secure: as the JS bundle
       * contains decryption key and is able to decode it at the client side.
       * Hovewer, for a number of reasons, encryption of injected data is still
       * better than injection of a plain text. */
      const payload = serializeJs({
        CHUNK_GROUPS: chunkGroups,
        CONFIG: configToInject ?? sanitizedConfig,
        ISTATE: ssrContext.state,
      }, {
        ignoreFunction: true,
        unsafe: true,
      });
      cipher.update(forge.util.createBuffer(payload, 'utf8'));
      cipher.finish();
      const INJ = forge.util.encode64(`${iv}${cipher.output.data}`);

      const chunkSet = new Set<string>();

      // TODO: "main" chunk has to be added explicitly,
      // because unlike all other chunks they are not managed by <CodeSplit>
      // component, thus they are not added to the ssrContext.chunks
      // automatically. Actually, names of these entry chunks should be
      // read from Wepback config, as the end user may customize them,
      // remove or add other entry points, but it requires additional
      // efforts to figure out how to automatically order them right,
      // thus for now this handles the default config.
      [
        'main',
        ...ssrContext.chunks,
      ].forEach((chunk) => {
        const assets = chunkGroups[chunk];
        if (assets) assets.forEach((asset) => chunkSet.add(asset));
      });

      let styleChunkString = '';
      let scriptChunkString = '';
      chunkSet.forEach((chunk) => {
        if (chunk.endsWith('.css')) {
          styleChunkString += `<link href="${publicPath as string}${chunk}" rel="stylesheet">`;
        } else if (
          chunk.endsWith('.js')
          // In dev mode HMR adds JS updates into asset arrays,
          // and they (updates) should be ignored.
          && !chunk.endsWith('.hot-update.js')
        ) {
          scriptChunkString += `<script src="${publicPath as string}${chunk}" type="application/javascript"></script>`;
        }
      });

      const grouppedExtraScripts = groupExtraScripts(extraScripts);

      const faviconLink = ops.favicon
        ? '<link rel="shortcut icon" href="/favicon.ico">'
        : '';

      const html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            ${grouppedExtraScripts[SCRIPT_LOCATIONS.HEAD_OPEN]}
            ${helmet?.title.toString() ?? ''}
            ${helmet?.meta.toString() ?? ''}
            <meta name="theme-color" content="#FFFFFF">
            ${manifestLink}
            ${helmet?.link.toString() ?? ''}${styleChunkString}
            ${faviconLink}
            <meta charset="utf-8">
            <meta
              content="width=device-width,initial-scale=1.0"
              name="viewport"
            >
            <meta itemprop="drpruinj" content="${INJ}">
          </head>
          <body>
            ${grouppedExtraScripts[SCRIPT_LOCATIONS.BODY_OPEN]}
            <div id="react-view">${appHtmlMarkup}</div>
            ${scriptChunkString}
            ${grouppedExtraScripts[SCRIPT_LOCATIONS.DEFAULT]}
          </body>
        </html>`;

      const status = ssrContext.status || 200;
      if (status !== 200) res.status(status);

      if (cacheRef && status < 500) {
        // Note: waiting for the caching to complete is not strictly necessary,
        // but it greately simplifies testing, and error reporting.
        await new Promise<void>((done, failed) => {
          brotliCompress(html, (error, buffer) => {
            const b = buffer as BufferWithNonce;
            if (error) failed(error);
            else {
              b.nonce = (req as unknown as {
                nonce: string;
              }).nonce;
              cache!.add({ buffer: b, status }, cacheRef.key, buffer.length);
              done();
            }
          });
        });
      }

      // Note: as caching code above may throw in some cases, sending response
      // before it completes will likely hide the error, making it difficult
      // to debug. Thus, at least for now, lets send response after it.
      res.send(html);
    } catch (error) {
      next(error);
    }
  };
}
