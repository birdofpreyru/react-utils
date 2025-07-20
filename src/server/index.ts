// eslint-disable-next-line import/no-unassigned-import
import 'source-map-support/register';

import http from 'node:http';
import https from 'node:https';

import {
  cloneDeep,
  defaults,
  isFinite,
  isNumber,
  isString,
  toNumber,
} from 'lodash';

// Polyfill required by ReactJS.
// TODO: Double-check, if it is still required by React v19?
// eslint-disable-next-line import/no-unassigned-import
import 'raf/polyfill';

import type { Configuration } from 'webpack';

import serverFactory, {
  type OptionsT as ServerOptionsT,
  type ServerT,
  getDefaultCspSettings,
} from './server';

import { SCRIPT_LOCATIONS, newDefaultLogger } from './renderer';

import { errors } from './utils';

export type {
  BeforeRenderResT,
  BeforeRenderT,
  ConfigT,
  ServerSsrContext,
} from './renderer';

export { errors, getDefaultCspSettings, type ServerT };

/**
 * Normalizes a port into a number, string, or false.
 * TODO: Drop this function?
 * @param value Port name or number.
 * @return Port number (Number), name (String), or false.
 */
function normalizePort(value: number | string) {
  const port = toNumber(value);
  if (isFinite(port)) return port; /* port number */
  if (!isNumber(port)) return value; /* named pipe */
  return false;
}

type OptionsT = ServerOptionsT & {
  https?: {
    cert: string;
    key: string;
  };

  // TODO: Should we limit it to number | string, and throw if it is different value?
  port?: false | number | string;
};

/**
 * Creates and launches web-server for ReactJS application. Allows zero
 * or detailed configuration, supports server-side rendering,
 * and development tools, including Hot Module Reloading (HMR).
 *
 * NOTE: Many of options defined below are passed down to the server and
 * renderer factories, and their declared default values are set in those
 * factories, rather than here.
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
 * @param {string} [options.defaultLoggerLogLevel='info'] Log level for
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
 * @return Resolves to an object with created Express and HTTP servers.
 */
export default async function launchServer(
  webpackConfig: Configuration,
  options: OptionsT = {},
): Promise<{
  expressServer: ServerT;
  httpServer: http.Server;
}> {
  /* Options normalization. */
  const ops = cloneDeep(options);

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  ops.port = normalizePort(ops.port || process.env.PORT || 3000);
  defaults(ops, { httpsRedirect: true });

  // TODO: Need a separate type for normalized options, which guarantees
  // the logger is set!
  ops.logger ??= newDefaultLogger({
    defaultLogLevel: ops.defaultLoggerLogLevel,
  });

  /* Creates servers, resolves and sets the port. */
  const expressServer = await serverFactory(webpackConfig, ops);

  let httpServer: http.Server;
  if (ops.https) {
    httpServer = https.createServer({
      cert: ops.https.cert,
      key: ops.https.key,
    }, expressServer as unknown as () => void);
  } else httpServer = http.createServer(expressServer as unknown as () => void);

  /* Sets error handler for HTTP(S) server. */
  httpServer.on('error', (error: Error) => {
    if ((error as { syscall?: string }).syscall !== 'listen') throw error;
    const bind = isString(ops.port) ? `Pipe ${ops.port}` : `Port ${ops.port}`;

    /* Human-readable message for some specific listen errors. */
    switch ((error as { code?: string }).code) {
      case 'EACCES':
        ops.logger!.error(`${bind} requires elevated privileges`);
        return process.exit(1);
      case 'EADDRINUSE':
        ops.logger!.error(`${bind} is already in use`);
        return process.exit(1);
      case undefined:
      default:
        throw error;
    }
  });

  /* Listening event handler for HTTP(S) server. */
  httpServer.on('listening', () => {
    const addr = httpServer.address()!;
    const bind = isString(addr) ? `pipe ${addr}` : `port ${addr.port}`;
    ops.logger!.info(`Server listening on ${bind} in ${
      process.env.NODE_ENV} mode`);
  });

  httpServer.listen(ops.port);

  return {
    expressServer,
    httpServer,
  };
}

launchServer.SCRIPT_LOCATIONS = SCRIPT_LOCATIONS;
launchServer.getDefaultCspSettings = getDefaultCspSettings;
launchServer.errors = errors;
