/**
 * ExpressJS middleware for server-side rendering of a ReactJS app.
 */

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import _ from 'lodash';
import config from 'config';
import forge from 'node-forge';
import fs from 'fs';
import path from 'path';
import { brotliCompress, brotliDecompress } from 'zlib';

import ReactDOM from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import serializeJs from 'serialize-javascript';

import time from 'utils/time';

import Cache from './Cache';

const sanitizedConfig = _.omit(config, 'SECRET');

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
 * Creates the middleware.
 * @param {object} webpackConfig
 * @param {object} options Additional options:
 * @param {boolean} [options.favicon] `true` will include favicon
 *  link into the rendered HTML templates.
 * @param {boolean} [options.noCsp] `true` means that no
 * Content-Security-Policy (CSP) is used by server, thus the renderer
 * may cut a few corners.
 * @param {number} options.maxSsrRounds
 * @param {number} options.ssrTimeout
 * @return {function} Created middleware.
 */
export default function factory(webpackConfig, options) {
  const buildInfo = getBuildInfo(webpackConfig.context);

  global.TRU_BUILD_INFO = buildInfo;

  // publicPath from webpack.output has a trailing slash at the end.
  const { publicPath, path: outputPath } = webpackConfig.output;

  let manifestLink = fs.existsSync(`${outputPath}/manifest.json`);
  manifestLink = manifestLink ? (
    `<link rel="manifest" href="${publicPath}manifest.json"></link>`
  ) : '';

  // TODO: Update the caching mechanics to stored cached data gzipped,
  // and serve them without a need to unpacking server-side.
  const cache = options.staticCacheController
    ? new Cache(options.staticCacheSize) : null;

  const CHUNK_GROUPS = readChunkGroupsJson(outputPath);

  const ops = _.defaults(_.clone(options), {
    beforeRender: () => Promise.resolve({}),
  });

  return async (req, res, next) => {
    try {
      let cacheRef;
      if (cache) {
        cacheRef = options.staticCacheController(req);
        if (cacheRef) {
          const data = cache.get(cacheRef);
          if (data !== null) {
            if (options.noCsp && isBrotliAcceptable(req)) {
              res.set('Content-Type', 'text/html');
              res.set('Content-Encoding', 'br');
              res.send(data);
            } else {
              brotliDecompress(data, (error, html) => {
                if (error) next(error);
                else {
                  let h = html.toString();
                  if (!options.noCsp) {
                    // TODO: Starting from Node v15 we'll be able to use string's
                    // .replaceAll() method instead relying on reg. expression for
                    // global matching.
                    const regex = new RegExp(data.nonce, 'g');
                    h = h.replace(regex, req.nonce);
                  }
                  res.send(h);
                }
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
      let App = options.Application;
      const ssrContext = {
        req,
        state: _.cloneDeep(initialState || {}),

        // Array of chunk names encountered during the rendering.
        chunks: [],
      };
      if (App) {
        let markup;
        const ssrStart = Date.now();
        for (let round = 0; round < options.maxSsrRounds; ++round) {
          ssrContext.chunks = [];
          markup = ReactDOM.renderToString((
            <GlobalStateProvider
              initialState={ssrContext.state}
              ssrContext={ssrContext}
            >
              <StaticRouter location={req.url || '/'}>
                <App />
              </StaticRouter>
            </GlobalStateProvider>
          ));

          if (!ssrContext.dirty) break;

          /* eslint-disable no-await-in-loop */
          const timeout = options.ssrTimeout + ssrStart - Date.now();
          const ok = timeout > 0 && await Promise.race([
            Promise.allSettled(ssrContext.pending),
            time.timer(timeout).then(() => false),
          ]);
          if (!ok) break;
          /* eslint-enable no-await-in-loop */
        }
        App = markup;

        /* This takes care about server-side rendering of page title and meta tags
        * (still demands injection into HTML template, which happens below). */
        helmet = Helmet.renderStatic();
      }

      let chunkGroups;
      const webpackStats = _.get(res.locals, 'webpack.devMiddleware.stats');
      if (webpackStats) {
        chunkGroups = _.mapValues(
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

      if (ssrContext.status) res.status(ssrContext.status);

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
          styleChunkString += `<link href="${publicPath}${chunk}" rel="stylesheet" />`;
        } else if (
          chunk.endsWith('.js')
            // In dev mode HMR adds JS updates into asset arrays,
            // and they (updates) should be ignored.
            && !chunk.endsWith('.hot-update.js')
        ) {
          scriptChunkString += `<script src="${publicPath}${chunk}" type="application/javascript"></script>`;
        }
      });

      let bodyOpenExtraScripts;
      let defaultExtraScripts;
      let headOpenExtraScripts;
      if (extraScripts) {
        bodyOpenExtraScripts = extraScripts
          .filter((script) => _.isObject(script)
            && script.location === SCRIPT_LOCATIONS.BODY_OPEN)
          .map((script) => script.code)
          .join('');
        defaultExtraScripts = extraScripts
          .filter((script) => _.isString(script)
            || script.location === SCRIPT_LOCATIONS.DEFAULT)
          .map((script) => (_.isString(script) ? script : script.code))
          .join('');
        headOpenExtraScripts = extraScripts
          .filter((script) => _.isObject(script)
            && script.location === SCRIPT_LOCATIONS.HEAD_OPEN)
          .map((script) => script.code)
          .join('');
      }

      const faviconLink = ops.favicon ? (
        '<link rel="shortcut icon" href="/favicon.ico" />'
      ) : '';

      const html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            ${headOpenExtraScripts || ''}
            ${helmet ? helmet.title.toString() : ''}
            ${helmet ? helmet.meta.toString() : ''}
            <meta name="theme-color" content="#FFFFFF"/>
            ${manifestLink}
            ${styleChunkString}
            ${faviconLink}
            <meta charset="utf-8" />
            <meta
              content="width=device-width,initial-scale=1.0"
              name="viewport"
            />
          </head>
          <body>
            ${bodyOpenExtraScripts || ''}
            <div id="react-view">${App || ''}</div>
            <script
              id="inj"
              type="application/javascript"
              ${options.noCsp ? '' : `nonce="${req.nonce}"`}
            >
              window.INJ="${INJ}"
            </script>
            ${scriptChunkString}
            ${defaultExtraScripts || ''}
          </body>
        </html>`;

      res.send(html);

      if (cacheRef) {
        brotliCompress(html, (error, buffer) => {
          if (error) throw error;
          buffer.nonce = req.nonce; // eslint-disable-line no-param-reassign
          cache.add(buffer, cacheRef.key);
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
