import 'source-map-support/register';

import _ from 'lodash';
import http from 'http';
import https from 'https';

/* Polyfill required by ReactJS. */
import 'raf/polyfill';

import winston from 'winston';

import serverFactory from './server';
import { SCRIPT_LOCATIONS } from './renderer';

export { getDefaultCspSettings } from './server';
export * from './utils';

/**
 * Normalizes a port into a number, string, or false.
 * TODO: Drop this function?
 * @ignore
 * @param {String} value Port name or number.
 * @return Port number (Number), name (String), or false.
 */
function normalizePort(value) {
  const port = _.toNumber(value);
  if (_.isFinite(port)) return port; /* port number */
  if (!_.isNumber(port)) return value; /* named pipe */
  return false;
}

/**
 * @category Utilities
 * @callback BeforeRenderHook
 * @desc A hook for {@link server}'s `beforeRender` option.
 * @param {object} req Incoming ExpressJS HTTP request, with some extra
 * fields attached:
 *  - `.nonce: string` &ndash; CSP nonce for `<script>` tags, which should be
 *    added to the tags injected into the page to allow them to work.
 * @param {object} config Application config that server wants to
 * inject into generated HTML template.
 * @return {Promise<{
 *   configToInject: object,
 *   extraScript: Array<object|string>,
 *   initialState: object
 * }>} `Promise` resolving to the object with fields:
 *  - `[configToInject]` (_Object_) &ndash; Optional. The actual config object
 * to inject into the generated page. If not provided, the `config` provided as
 * argument will be injected as is.
 * - `[extraScripts]` (_Array of Objects and/or Strings_) &ndash; Optional.
 * Additional scripts to inject into the generated page. Each script given
 * as a string will be injected as is in the end of generated document's
 * `<body>`, just before the main application bundle. Each script given as
 * an object is expected to have two fields: `code` holding the actual code
 * to inject, and `location` specifying where to inject that `code`. The valid
 * locations are exposed via the `server.SCRIPT_LOCATIONS` object. The scripts
 * intended for the same location are injected in the order
 * they are listed in the `extraScript` array.
 * - `[initialState]` (_Object_) &ndash; Optional. Initial value of the global
 * state.
 *
 * `server.SCRIPT_LOCATIONS`
 * - `server.SCRIPT_LOCATIONS.BODY_OPEN` &ndash; Right after the opening
 * `<body>`
 * tag.
 * - `server.SCRIPT_LOCATIONS.DEFAULT` &ndash; In the end of `<body>` block, just
 * before the main application bundle.
 * - `server.SCRIPT_LOCATIONS.HEAD_OPEN` &ndash; Right after the opening
 * `<head>` tag.
*/

/**
 * @category Utilities
 * @func server
 * @desc
 * ```js
 * import { server } from '@dr.pogodin/react-utils`;
 * import webpackConfig from 'path/to/your/webpack.config';
 * server(webpackConfig);
 * // Web server is up, running, and serving the app specified by the provided
 * // Webpack config.
 * ```
 * Creates and launches web-server for ReactJS application. Allows zero
 * or detailed configuration, supports server-side rendering,
 * and development tools, including Hot Module Reloading (HMR).
 *
 * See {@link module:ReactGlobalState ReactGlobalState} for some additional
 * notes related to SSR, access to incoming requests during SSR, _etc._
 *
 * @param {object} webpackConfig Webpack configuration used to build
 * the frontend bundle. In production mode the server will read out of it
 * `context`, `publicPath`, and a few other parameters, necessary to locate
 * and serve the app bundle. In development mode the server will use entire
 * provided config to build the app bundle in memory, and further watch and
 * update it via HMR.
 * @param {object} [options] Additional parameters.
 * @param {Component} [options.Application] The root ReactJS component of
 * the app to use for the server-side rendering. When not provided
 * the server-side rendering is disabled.
 * @param {function} [options.beforeExpressJsError] Asynchronous callback
 * (`(server) => Promise<boolean>`) to be executed just before the default error
 * handler is added to ExpressJS server. If the callback is provided and its
 * result resolves to a truthy value, `react-utils` won't attach the default
 * error handler.
 * @param {function} [options.beforeExpressJsSetup] Asynchronous callback
 * (`(server) => Promise) to be executed right after ExpressJS server creation,
 * before any configuration is performed.
 * @param {BeforeRenderHook} [options.beforeRender] The hook to run just before
 * the server-side rendering. For each incoming request, it will be executed
 * just before the HTML markup is generated at the server. It allows to load
 * and provide the data necessary for server-side rendering, and also to inject
 * additional configuration and scripts into the generated HTML code.
 * @param {boolean} [options.noCsp] Set `true` to disable
 * Content-Security-Policy (CSP) headers altogether.
 * @param {function} [options.cspSettingsHook] A hook allowing
 * to customize [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
 * settings for [helmet](https://github.com/helmetjs/helmet)'s
 * `contentSecurityPolicy` middleware on per-request basis.
 *
 * If provided it should be a with signature: \
 * `(defaultSettings: object, req: object)` &rArr; `object` \
 * which gets the default settings (also used without the hook),
 * and the incoming request object. The hook response will be passed
 * as options to the helmet `contentSecurityPolicy` middleware.
 *
 * Currently, the default settings is the following object in production
 * environment:
 * ```js
 * {
 *   directives: {
 *     defaultSrc: ["'self'"],
 *     baseUri: ["'self'"],
 *     blockAllMixedContent: [],
 *     fontSrc: ["'self'", 'https:', 'data:'],
 *     frameAncestors: ["'self'"],
 *     frameSrc: ["'self'", 'https://*.youtube.com'],
 *     imgSrc: ["'self'", 'data:'],
 *     objectSrc: ["'none'"],
 *     scriptSrc: ["'self'", "'unsafe-eval'", `'nonce-UNIQUE_NONCE_VALUE'`],
 *     scriptSrcAttr: ["'none'"],
 *     styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
 *     upgradeInsecureRequests: [] // Removed in dev mode.
 *   }
 * }
 * ```
 * It matches the default value used by Helmet with a few updates:
 * - YouTube host is whitelisted in the `frameSrc` directive to ensure
 *   the {@link YouTubeVideo} component works.
 * - An unique per-request nonce is added to `scriptSrc` directive to
 *   whitelist auxiliary scripts injected by react-utils. The actual nonce
 *   value can be fetched by host code via `.nonce` field of `req` argument
 *   of `.beforeRender` hook.
 * - `upgradeInsecureRequests` directive is removed in development mode,
 *   to simplify local testing with http requests.
 * @param {string} [options.defaultLoggerLogLevel=info] Log level for
 * the default logger, which is created if no `logger` option provided.
 * @param {boolean} [options.devMode] Pass in `true` to start the server in
 * development mode.
 * @param {string} [options.favicon] Path to the favicon to use by the server.
 * By default no favicon is used.
 * @param {object} [options.https] If provided, HTTPS server will be started,
 * instead of HTTP otherwise. The object should provide SSL certificate and key
 * via two string fields: `cert`, and `key`.
 * @param {string} [options.https.cert] SSL Certificate.
 * @param {string} [options.https.key] SSL key.
 * @param {boolean} [options.httpsRedirect=true] Pass in `true` to enable
 * automatic redirection of all incoming HTTP requests to HTTPS.
 *
 * To smoothly use it at `localhost` you need to run the server in HTTPS mode,
 * and also properly create and install a self-signed SSL sertificate on your
 * system. This article is helpful:
 * [How to get HTTPS working on your local development environment in 5 minutes](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec)
 * @param {Logger} [options.logger] The logger to use at server side.
 * By default [`winston`](https://www.npmjs.com/package/winston) logger
 * with console transport is used. The logger you provide, or the default
 * `winston` logger otherwise, will be attached to the created ExpressJS server
 * object.
 * @param {function} [options.onExpressJsSetup] An async callback
 * (`(server) => Promise`) to be triggered when most of the server
 * configuration is completed, just before the server-side renderer,
 * and the default error handler are attached. You can use it to mount
 * custom API routes. The server-side logger can be accessed as `server.logger`.
 * @param {number|string} [options.port=3000] The port to start the server on.
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
 * @param {number} [options.maxSsrRounds=10] Maximum number of SSR rounds.
 * @param {number} [options.ssrTimeout=1000] SSR timeout in milliseconds,
 * defaults to 1 second.
 * @return {Promise<{ expressServer: object, httpServer: object }>} Resolves to
 * an object with created Express and HTTP servers.
 */
async function launch(webpackConfig, options) {
  /* Options normalization. */
  const ops = options ? _.cloneDeep(options) : {};
  ops.port = normalizePort(ops.port || process.env.PORT || 3000);
  _.defaults(ops, {
    httpsRedirect: true,
    ssrTimeout: 1000,
  });
  if (!ops.staticCacheSize) ops.staticCacheSize = 1.e7;

  if (_.isUndefined(ops.logger)) {
    const { format, transports } = winston;
    ops.logger = winston.createLogger({
      level: ops.defaultLoggerLogLevel || 'info',
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

  /* Creates servers, resolves and sets the port. */
  const expressServer = await serverFactory(webpackConfig, ops);

  let httpServer;
  if (ops.https) {
    httpServer = https.createServer({
      cert: ops.https.cert,
      key: ops.https.key,
    }, expressServer);
  } else httpServer = http.createServer(expressServer);

  /* Sets error handler for HTTP(S) server. */
  httpServer.on('error', (error) => {
    if (error.syscall !== 'listen') throw error;
    const bind = _.isString(ops.port) ? `Pipe ${ops.port}` : `Port ${ops.port}`;

    /* Human-readable message for some specific listen errors. */
    switch (error.code) {
      case 'EACCES':
        ops.logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        ops.logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  /* Listening event handler for HTTP(S) server. */
  httpServer.on('listening', () => {
    const addr = httpServer.address();
    const bind = _.isString(addr) ? `pipe ${addr}` : `port ${addr.port}`;
    ops.logger.info(`Server listening on ${bind} in ${
      process.env.NODE_ENV} mode`);
  });

  httpServer.listen(ops.port);

  return {
    expressServer,
    httpServer,
  };
}

launch.SCRIPT_LOCATIONS = SCRIPT_LOCATIONS;

export default launch;
