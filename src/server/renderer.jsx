/**
 * ExpressJS middleware for server-side rendering of a ReactJS app.
 */

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import _ from 'lodash';
import config from 'config';
import forge from 'node-forge';
import fs from 'fs';
import path from 'path';
import ReactDOM from 'react-dom/server';

import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom';

// A peculiar way to import this is needed, as we want to use that import
// between the "react-utils-build" script, and the core library code, both
// in dev and built code.
/* eslint-disable global-require, import/no-unresolved */
let generateAssetMap;
try {
  generateAssetMap = require('../../../generate-asset-map');
} catch (error) {
  generateAssetMap = require('../../generate-asset-map');
}
generateAssetMap = generateAssetMap.generateAssetMap;
/* eslint-disable global-require, import/no-unresolved */

const sanitizedConfig = _.omit(config, 'SECRET');

const DEFAULT_MAX_SSR_ROUNDS = 10;

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
 * @param {String} context Webpack context path used during the build.
 * @return {Object} Resolves to the build-time information.
 */
function getBuildInfo(context) {
  const url = path.resolve(context, '.build-info');
  return JSON.parse(fs.readFileSync(url));
}

/**
 * Attempts to read from the disk "__asset_map__.json" file generated from
 * Webpack stats during the build.
 * It will not work for development builds, where the same information should
 * be (re-)generated on-fly from Webpack stats being captured
 * via compilator callback.
 * @param {String} buildDir
 * @return {Object} Resolves to the stats, or null, if cannot be read.
 */
function getGeneratedAssetMap(buildDir) {
  const url = path.resolve(buildDir, '__asset_map__.json');
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
 * Creates the middleware.
 * @param {object} webpackConfig
 * @param {object} options Additional options:
 * @param {boolean} [options.favicon] Optional. `true` will include favicon
 *  link into the rendered HTML templates.
 * @return {function} Created middleware.
 */
export default function factory(webpackConfig, options) {
  const buildInfo = getBuildInfo(webpackConfig.context);

  global.TRU_BUILD_INFO = buildInfo;

  /* It is supposed to end with '/' symbol as path separator. */
  const { publicPath, path: outputPath } = webpackConfig.output;

  let manifestLink = fs.existsSync(`${outputPath}/manifest.json`);
  manifestLink = manifestLink ? (
    `<link rel="manifest" href="${publicPath}manifest.json"></link>`
  ) : '';

  const ASSET_MAP = getGeneratedAssetMap(outputPath);

  const ops = _.defaults(_.clone(options), {
    beforeRender: () => Promise.resolve({}),
  });

  return async (req, res, next) => {
    try {
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

      let assetMap;
      const webpackStats = _.get(res.locals, 'webpack.devMiddleware.stats');
      if (webpackStats) {
        assetMap = generateAssetMap(webpackStats.toJson(), webpackConfig);
      } else if (ASSET_MAP) {
        assetMap = ASSET_MAP;
      } else {
        assetMap = {
          assets: {},
          assetsByChunkName: {},
          context: webpackConfig.context,
        };
      }

      /* Optional server-side rendering. */
      let App = options.Application;
      const ssrContext = {
        assetMap,
        req,
        state: _.cloneDeep(initialState || {}),

        // Array of chunk names encountered during the rendering.
        chunks: [],
      };
      if (App) {
        let markup;
        /* TODO: The limit number of rounds should be exposed as a config
         * option. */
        for (
          let round = 0;
          round < (options.maxSsrRounds || DEFAULT_MAX_SSR_ROUNDS);
          round += 1
        ) {
          /* eslint-disable no-await-in-loop */
          ssrContext.chunks = [];
          markup = ReactDOM.renderToString((
            <GlobalStateProvider
              initialState={ssrContext.state}
              ssrContext={ssrContext}
            >
              <StaticRouter
                context={ssrContext}
                location={req.url}
              >
                <App />
              </StaticRouter>
            </GlobalStateProvider>
          ));
          if (ssrContext.dirty) {
            await Promise.allSettled(ssrContext.pending);
          } else break;
          /* eslint-enable no-await-in-loop */
        }
        App = markup;

        /* This takes care about server-side rendering of page title and meta tags
        * (still demands injection into HTML template, which happens below). */
        helmet = Helmet.renderStatic();
      }

      /* Encrypts data to be injected into HTML.
       * Keep in mind, that this encryption is no way secure: as the JS bundle
       * contains decryption key and is able to decode it at the client side.
       * Hovewer, for a number of reasons, encryption of injected data is still
       * better than injection of a plain text. */
      delete ssrContext.state.dr_pogodin_react_utils___split_components;
      cipher.update(forge.util.createBuffer(JSON.stringify({
        ASSETS_BY_CHUNK_NAME: assetMap.assetsByChunkName,
        CONFIG: configToInject || sanitizedConfig,
        ISTATE: ssrContext.state,
      }), 'utf8'));
      cipher.finish();
      const INJ = forge.util.encode64(`${iv}${cipher.output.data}`);

      if (ssrContext.status) res.status(ssrContext.status);

      const chunkStyles = [];
      const chunkScripts = [];

      // TODO: "polyfills", and "main" chunks have to be added explicitly,
      // because unlike all other chunks they are not managed by <CodeSplit>
      // component, thus they are not added to the ssrContext.chunks
      // automatically. Actually, names of these entry chunks should be
      // read from Wepback config, as the end user may customize them,
      // remove or add other entry points, but it requires additional
      // efforts to figure out how to automatically order them right,
      // thus for now this handles the default config.
      [
        'polyfills',
        'main',
        ...ssrContext.chunks,
      ].forEach((chunk) => {
        let assets = assetMap.assetsByChunkName[chunk];
        if (!assets) return;
        if (!_.isArray(assets)) assets = [assets];

        assets.forEach((asset) => {
          if (asset.endsWith('.css')) {
            chunkStyles.push((
              `<link href="${publicPath}${asset}" rel="stylesheet" />`
            ));
          } else if (
            asset.endsWith('.js')
              // In dev mode HMR adds JS updates into asset arrays,
              // and they (updates) should be ignored.
              && !asset.endsWith('.hot-update.js')
          ) {
            chunkScripts.push((
              `<script src="${publicPath}${asset}" type="application/javascript"></script>`
            ));
          }
        });
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

      res.send((
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            ${headOpenExtraScripts || ''}
            ${helmet ? helmet.title.toString() : ''}
            ${helmet ? helmet.meta.toString() : ''}
            <meta name="theme-color" content="#FFFFFF"/>
            ${manifestLink}
            ${chunkStyles.join('')}
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
              nonce="${req.cspNonce}"
            >
              window.INJ="${INJ}"
            </script>
            ${chunkScripts.join('')}
            ${defaultExtraScripts || ''}
          </body>
        </html>`
      ));
    } catch (error) {
      next(error);
    }
  };
}
