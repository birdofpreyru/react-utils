/**
 * Creation of standard ExpressJS server for ReactJS apps.
 */

import _ from 'lodash';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import loggerMiddleware from 'morgan';
import requestIp from 'request-ip';
import { v4 as uuid } from 'uuid';

import rendererFactory from './renderer';

/**
 * Default Content Security Policy settings.
 */
const defaultCspSettings = {
  directives: _.mapValues(
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

export default async function factory(webpackConfig, options) {
  const rendererOps = _.pick(options, [
    'Application',
    'beforeRender',
    'favicon',
    'maxSsrRounds',
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
  server.use(helmet({ contentSecurityPolicy: false }));

  server.use((req, res, next) => {
    req.cspNonce = uuid();

    // The deep clone is necessary here to ensure that default value can't be
    // mutated during request processing.
    let cspSettings = _.cloneDeep(defaultCspSettings);
    cspSettings.directives['script-src'].push(`'nonce-${req.cspNonce}'`);
    if (options.cspSettingsHook) {
      cspSettings = options.cspSettingsHook(cspSettings, req);
    }
    helmet.contentSecurityPolicy(cspSettings)(req, res, next);
  });

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
  server.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

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
    server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
      options.logger.error(err.stack);

      let errorResponse = null;
      const status = err.isJoi ? 400 : err.httpStatus || err.status || 500;

      if (err.isJoi && _.isArray(err.details)) {
        _.map(err.details, (e) => {
          if (e.message) {
            if (!errorResponse) errorResponse = e.message;
            else errorResponse += `, ${e.message}`;
          }
        });
      }
      errorResponse = errorResponse || err.message || 'Internal Server Error';

      /* Sets locals. The actual errors are exposed only in dev. */
      _.assign(res, {
        locals: {
          error: req.app.get('env') === 'development' ? err : {},
          message: err.message,
        },
      });

      /* Finally, the error response. */
      res.status(status).send(errorResponse);
    });
  }

  return server;
}
