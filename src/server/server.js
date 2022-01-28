/**
 * Creation of standard ExpressJS server for ReactJS apps.
 */

import {
  cloneDeep,
  mapValues,
  pick,
} from 'lodash';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import loggerMiddleware from 'morgan';
import requestIp from 'request-ip';
import { v4 as uuid } from 'uuid';

import rendererFactory from './renderer';

import {
  CODES,
  ERRORS,
  fail,
  getErrorForCode,
} from './utils/errors';

/**
 * Default Content Security Policy settings.
 * @ignore
 */
const defaultCspSettings = {
  directives: mapValues(
    helmet.contentSecurityPolicy.getDefaultDirectives(),

    // 'https:' options (automatic re-write of insecure URLs to secure ones)
    // is removed to facilitate local development with HTTP server. In cloud
    // deployments we assume Apache or Nginx server in front of out app takes
    // care about such re-writes.
    (array) => array.filter((item) => item !== 'https:'),
  ),
};
defaultCspSettings.directives['frame-src'] = [
  "'self'",

  // YouTube domain is whitelisted to allow <YouTubeVideo> component to work
  // out of box.
  'https://*.youtube.com',
];
defaultCspSettings.directives['script-src'].push("'unsafe-eval'");

// No need for automatic re-writes via Content Security Policy settings:
// the forefront Apache or Nginx server is supposed to take care of this
// in production cloud deployments.
delete defaultCspSettings.directives['upgrade-insecure-requests'];

/**
 * @category Utilities
 * @func server/getDefaultCspSettings
 * @global
 * @desc
 * ```js
 * import { server } from '@dr.pogodin/react-utils';
 * const { getDefaultCspSettings } from '@dr.pogodin/react-utils';
 * ```
 * @return {{
 *   directives: object
 * }} A deep copy of default CSP settings object used by `react-utils`,
 * with the exception of `nonce-xxx` clause in `script-src` directive,
 * which is added dynamically for each request.
 */
export function getDefaultCspSettings() {
  return cloneDeep(defaultCspSettings);
}

export default async function factory(webpackConfig, options) {
  const rendererOps = pick(options, [
    'Application',
    'beforeRender',
    'favicon',
    'maxSsrRounds',
    'noCsp',
    'ssrTimeout',
    'staticCacheController',
    'staticCacheSize',
  ]);
  const renderer = rendererFactory(webpackConfig, rendererOps);
  const { publicPath } = webpackConfig.output;

  const server = express();

  if (options.beforeExpressJsSetup) {
    await options.beforeExpressJsSetup(server);
  }

  server.logger = options.logger;

  if (options.httpsRedirect) {
    server.use((req, res, next) => {
      const schema = req.headers['x-forwarded-proto'];
      if (schema === 'http') {
        let url = `https://${req.headers.host}`;
        if (req.originalUrl !== '/') url += req.originalUrl;
        return res.redirect(url);
      }
      return next();
    });
  }

  server.use(compression());
  server.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );

  if (!options.noCsp) {
    server.use((req, res, next) => {
      req.nonce = uuid();

      // TODO: This is deprecated, but it is kept for now for backward
      // compatibility. Should be removed sometime later.
      req.cspNonce = req.nonce;

      // The deep clone is necessary here to ensure that default value can't be
      // mutated during request processing.
      let cspSettings = cloneDeep(defaultCspSettings);
      cspSettings.directives['script-src'].push(`'nonce-${req.nonce}'`);
      if (options.cspSettingsHook) {
        cspSettings = options.cspSettingsHook(cspSettings, req);
      }
      helmet.contentSecurityPolicy(cspSettings)(req, res, next);
    });
  }

  if (options.favicon) {
    server.use(favicon(options.favicon));
  }

  server.use('/robots.txt', (req, res) => res.send('User-agent: *\nDisallow:'));

  server.use(express.json({ limit: '300kb' }));
  server.use(express.urlencoded({ extended: false }));
  server.use(cookieParser());
  server.use(requestIp.mw());

  loggerMiddleware.token('ip', (req) => req.clientIp);
  const FORMAT = ':ip > :status :method :url :response-time ms :res[content-length] :referrer :user-agent';
  server.use(loggerMiddleware(FORMAT, {
    stream: {
      write: options.logger.info.bind(options.logger),
    },
  }));

  /* Ensures no caching for the service worker script. */
  server.use(`${publicPath}service-worker.js`, (req, res, next) => {
    res.header('Cache-Control', 'no-cache');
    next();
  });

  /* Setup of Hot Module Reloading for development environment.
   * These dependencies are not used, nor installed for production use,
   * hence we should violate some import-related lint rules. */
  /* eslint-disable global-require */
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable import/no-unresolved */
  if (options.devMode) {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    server.use(webpackDevMiddleware(compiler, {
      publicPath,
      serverSideRender: true,
    }));
    server.use(webpackHotMiddleware(compiler));
  }
  /* eslint-enable global-require */
  /* eslint-enable import/no-extraneous-dependencies */
  /* eslint-enable import/no-unresolved */

  server.use(publicPath, express.static(webpackConfig.output.path));

  if (options.onExpressJsSetup) {
    await options.onExpressJsSetup(server);
  }
  server.use(renderer);

  /* Detects 404 errors, and forwards them to the error handler. */
  server.use(() => fail(ERRORS.NOT_FOUND, CODES.NOT_FOUND));

  let dontAttachDefaultErrorHandler;
  if (options.beforeExpressJsError) {
    dontAttachDefaultErrorHandler = await options.beforeExpressJsError(server);
  }

  /* Error handler. */
  if (!dontAttachDefaultErrorHandler) {
    // TODO: It is better to move the default error handler definition
    // to a stand-alone function at top-level, but the use of options.logger
    // prevents to do it without some extra refactoring. Should be done sometime
    // though.
    /* eslint-disable no-unused-vars */
    server.use((error, req, res, next) => {
    /* eslint-enable no-unused-vars */
      const status = error.status || CODES.INTERNAL_SERVER_ERROR;
      const serverSide = status >= CODES.INTERNAL_SERVER_ERROR;

      // Log server-side errors always, client-side at debug level only.
      options.logger.log(serverSide ? 'error' : 'debug', error);

      let message = error.message || getErrorForCode(status);
      if (serverSide && process.env.NODE_ENV === 'production') {
        message = ERRORS.INTERNAL_SERVER_ERROR;
      }

      res.status(status).send(message);
    });
  }

  return server;
}
