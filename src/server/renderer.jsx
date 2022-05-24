/**
 * ExpressJS middleware for server-side rendering of a ReactJS app.
 */

import { Writable } from 'stream';

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

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
import fs from 'fs';
import path from 'path';
import { brotliCompress, brotliDecompress } from 'zlib';

import { renderToPipeableStream } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import serializeJs from 'serialize-javascript';
import time from 'utils/time';
import winston from 'winston';

import Cache from './Cache';

const sanitizedConfig = omit(config, 'SECRET');

export const SCRIPT_LOCATIONS = {
  BODY_OPEN: 'BODY_OPEN',
  DEFAULT: 'DEFAULT',
  HEAD_OPEN: 'HEAD_OPEN',
};

/**
 * Reads build-time information about the app. This information is generated
 * by our standard Webpack config for apps, and it is written into
 * ".build-info" file in the context folder specified in Webpack config.
 * At the moment, that file contains build timestamp and a random 32-bit key,
 * suitable for cryptographical use.
 * @ignore
 * @param {String} context Webpack context path used during the build.
 * @return {Object} Resolves to the build-time information.
 */
function getBuildInfo(context) {
  const url = path.resolve(context, '.build-info');
  return JSON.parse(fs.readFileSync(url));
}

/**
 * Attempts to read from disk the named chunk groups mapping generated
 * by Webpack during the compilation.
 * It will not work for development builds, where these stats should be captured
 * via compilator callback.
 * @ignore
 * @param {string} buildDir
 * @return {object}
 */
function readChunkGroupsJson(buildDir) {
  const url = path.resolve(buildDir, '__chunk_groups__.json');
  let res;
  try {
    res = JSON.parse(fs.readFileSync(url));
  } catch (err) {
    res = null;
  }
  return res;
}

/**
 * Prepares a new Cipher for data encryption.
 * @ignore
 * @param {String} key Encryption key (32-bit random key is expected, see
 *  node-forge documentation, in case of doubts).
 * @return {Promise} Resolves to the object with two fields:
 *  1. cipher - a new Cipher, ready for encryption;
 *  2. iv - initial vector used by the cipher.
 */
function prepareCipher(key) {
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
 * @param {object} req
 * @return {boolean}
 * @ignore
 */
export function isBrotliAcceptable(req) {
  const acceptable = req.get('accept-encoding');
  if (acceptable) {
    const ops = acceptable.split(',');
    for (let i = 0; i < ops.length; ++i) {
      const [type, priority] = ops[i].trim().split(';q=');
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
function groupExtraScripts(scripts = []) {
  const res = {
    [SCRIPT_LOCATIONS.BODY_OPEN]: '',
    [SCRIPT_LOCATIONS.DEFAULT]: '',
    [SCRIPT_LOCATIONS.HEAD_OPEN]: '',
  };
  for (let i = 0; i < scripts.length; ++i) {
    const script = scripts[i];
    if (isString(script)) {
      if (script) res[SCRIPT_LOCATIONS.DEFAULT] += script;
    } else if (script.code) {
      if (res[script.location] !== undefined) {
        res[script.location] += script.code;
      } else throw Error(`Invalid location "${script.location}"`);
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
} = {}) {
  const { format, transports } = winston;
  return winston.createLogger({
    level: defaultLogLevel,
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
          let res = `${level}\t(at ${timestamp}):\t${message}`;
          if (Object.keys(rest).length) {
            res += `\n${JSON.stringify(rest, null, 2)}`;
          }
          if (stack) res += `\n${stack}`;
          return res;
        },
      ),
    ),
    transports: [new transports.Console()],
  });
}

/**
 * Creates the middleware.
 * @param {object} webpackConfig
 * @param {object} options Additional options:
 * @param {Component} [options.Application] The root ReactJS component of
 * the app to use for the server-side rendering. When not provided
 * the server-side rendering is disabled.
 * @param {object} [options.buildInfo] "Build info" object to use. If provided,
 *  it will be used, instead of trying to load from the filesystem the one
 *  generated by the Webpack build. It is intended for test environments,
 *  where passing this stuff via file system is no bueno.
 * @param {boolean} [options.favicon] `true` will include favicon
 *  link into the rendered HTML templates.
 * @param {boolean} [options.noCsp] `true` means that no
 * Content-Security-Policy (CSP) is used by server, thus the renderer
 * may cut a few corners.
 * @param {number} [options.maxSsrRounds=10] Maximum number of SSR rounds.
 * @param {number} [options.ssrTimeout=1000] SSR timeout in milliseconds,
 * defaults to 1 second.
 * @param {number} [options.staticCacheSize=1.e7] The maximum
 * static cache size in bytes. Defaults to ~10 MB.
 * @param {function} [options.staticCacheController] When given, it activates,
 * and controls the static caching of generated HTML markup. When this function
 * is provided, on each incoming request it is triggered with the request
 * passed in as the argument. To attempt to serve the response from the cache
 * it should return the object with the following fields:
 * - `key: string` &ndash; the cache key for the response;
 * - `maxage?: number` &ndash; the maximum age of cached result in ms.
 *   If undefined - infinite age is assumed.
 * @return {function} Created middleware.
 */
export default function factory(webpackConfig, options) {
  const ops = defaults(clone(options), {
    beforeRender: () => Promise.resolve({}),
    maxSsrRounds: 10,
    ssrTimeout: 1000,
    staticCacheSize: 1.e7,
  });

  // Note: in normal use the default logger is created and set in the root
  // server function, and this initialization is for testing uses, where
  // renderer is imported directly.
  if (ops.logger === undefined) {
    ops.logger = newDefaultLogger({
      defaultLogLevel: ops.defaultLoggerLogLevel,
    });
  }

  const buildInfo = ops.buildInfo || getBuildInfo(webpackConfig.context);
  global.TRU_BUILD_INFO = buildInfo;

  // publicPath from webpack.output has a trailing slash at the end.
  const { publicPath, path: outputPath } = webpackConfig.output;

  const manifestLink = fs.existsSync(`${outputPath}/manifest.json`)
    ? `<link rel="manifest" href="${publicPath}manifest.json">` : '';

  const cache = ops.staticCacheController
    ? new Cache(ops.staticCacheSize) : null;

  const CHUNK_GROUPS = readChunkGroupsJson(outputPath);

  return async (req, res, next) => {
    try {
      // Ensures any caches always revalidate HTML markup before reuse.
      res.set('Cache-Control', 'no-cache');

      let cacheRef;
      if (cache) {
        cacheRef = ops.staticCacheController(req);
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
              await new Promise((done, failed) => {
                brotliDecompress(buffer, (error, html) => {
                  if (error) failed(error);
                  else {
                    let h = html.toString();
                    if (!ops.noCsp) {
                      // TODO: Starting from Node v15 we'll be able to use string's
                      // .replaceAll() method instead relying on reg. expression for
                      // global matching.
                      const regex = new RegExp(buffer.nonce, 'g');
                      h = h.replace(regex, req.nonce);
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
        ops.beforeRender(req, sanitizedConfig),
        prepareCipher(buildInfo.key),
      ]);

      let helmet;

      /* Optional server-side rendering. */
      let App = ops.Application;
      const ssrContext = {
        req,
        state: cloneDeep(initialState || {}),

        // Array of chunk names encountered during the rendering.
        chunks: [],
      };
      let stream;
      if (App) {
        const ssrStart = Date.now();

        const renderPass = async () => {
          ssrContext.chunks = [];
          return new Promise((resolve, reject) => {
            const pipeableStream = renderToPipeableStream(
              <GlobalStateProvider
                initialState={ssrContext.state}
                ssrContext={ssrContext}
              >
                <StaticRouter location={req.url}>
                  <App />
                </StaticRouter>
              </GlobalStateProvider>,
              {
                onAllReady: () => resolve(pipeableStream),
                onError: reject,
              },
            );
          });
        };

        let ssrRound = 0;
        let bailed = false;
        for (; ssrRound < ops.maxSsrRounds; ++ssrRound) {
          stream = await renderPass(); // eslint-disable-line no-await-in-loop

          if (!ssrContext.dirty) break;

          /* eslint-disable no-await-in-loop */
          const timeout = ops.ssrTimeout + ssrStart - Date.now();
          bailed = timeout <= 0 || !await Promise.race([
            Promise.allSettled(ssrContext.pending),
            time.timer(timeout).then(() => false),
          ]);
          if (bailed) break;
          /* eslint-enable no-await-in-loop */
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

        ops.logger.log(ssrContext.dirty ? 'warn' : 'info', logMsg);

        App = '';
        stream.pipe(new Writable({
          write: (chunk, _, done) => {
            App += chunk.toString();
            done();
          },
        }));

        /* This takes care about server-side rendering of page title and meta tags
        * (still demands injection into HTML template, which happens below). */
        helmet = Helmet.renderStatic();
      }

      let chunkGroups;
      const webpackStats = get(res.locals, 'webpack.devMiddleware.stats');
      if (webpackStats) {
        chunkGroups = mapValues(
          webpackStats.toJson({
            all: false,
            chunkGroups: true,
          }).namedChunkGroups,
          (item) => item.assets.map(({ name }) => name),
        );
      } else if (CHUNK_GROUPS) chunkGroups = CHUNK_GROUPS;
      else chunkGroups = {};

      /* Encrypts data to be injected into HTML.
       * Keep in mind, that this encryption is no way secure: as the JS bundle
       * contains decryption key and is able to decode it at the client side.
       * Hovewer, for a number of reasons, encryption of injected data is still
       * better than injection of a plain text. */
      delete ssrContext.state.dr_pogodin_react_utils___split_components;

      const payload = serializeJs({
        CHUNK_GROUPS: chunkGroups,
        CONFIG: configToInject || sanitizedConfig,
        ISTATE: ssrContext.state,
      }, {
        ignoreFunction: true,
        unsafe: true,
      });
      cipher.update(forge.util.createBuffer(payload, 'utf8'));
      cipher.finish();
      const INJ = forge.util.encode64(`${iv}${cipher.output.data}`);

      const status = ssrContext.status || 200;
      if (status !== 200) res.status(status);

      const chunkSet = new Set();

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
          styleChunkString += `<link href="${publicPath}${chunk}" rel="stylesheet">`;
        } else if (
          chunk.endsWith('.js')
            // In dev mode HMR adds JS updates into asset arrays,
            // and they (updates) should be ignored.
            && !chunk.endsWith('.hot-update.js')
        ) {
          scriptChunkString += `<script src="${publicPath}${chunk}" type="application/javascript"></script>`;
        }
      });

      const grouppedExtraScripts = groupExtraScripts(extraScripts);

      const faviconLink = ops.favicon ? (
        '<link rel="shortcut icon" href="/favicon.ico">'
      ) : '';

      const html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            ${grouppedExtraScripts[SCRIPT_LOCATIONS.HEAD_OPEN]}
            ${helmet ? helmet.title.toString() : ''}
            ${helmet ? helmet.meta.toString() : ''}
            <meta name="theme-color" content="#FFFFFF">
            ${manifestLink}
            ${styleChunkString}
            ${faviconLink}
            <meta charset="utf-8">
            <meta
              content="width=device-width,initial-scale=1.0"
              name="viewport"
            >
          </head>
          <body>
            ${grouppedExtraScripts[SCRIPT_LOCATIONS.BODY_OPEN]}
            <div id="react-view">${App || ''}</div>
            <script
              id="inj"
              type="application/javascript"
              ${ops.noCsp ? '' : `nonce="${req.nonce}"`}
            >
              window.INJ="${INJ}"
            </script>
            ${scriptChunkString}
            ${grouppedExtraScripts[SCRIPT_LOCATIONS.DEFAULT]}
          </body>
        </html>`;

      res.send(html);

      if (cacheRef && status < 500) {
        // Note: waiting for the caching to complete is not strictly necessary,
        // but it greately simplifies testing, and error reporting.
        await new Promise((done, failed) => {
          brotliCompress(html, (error, buffer) => {
            if (error) failed(error);
            else {
              buffer.nonce = req.nonce; // eslint-disable-line no-param-reassign
              cache.add({ buffer, status }, cacheRef.key);
              done();
            }
          });
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
