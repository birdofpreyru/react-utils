/**
 * Creation of standard ExpressJS server for ReactJS apps.
 */

import { sep } from 'node:path';
import { pathToFileURL } from 'node:url';

import cloneDeep from 'lodash/cloneDeep';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import csrf from '@dr.pogodin/csurf';

import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express';

import favicon from 'serve-favicon';
import helmet, { type HelmetOptions } from 'helmet';
import loggerMiddleware from 'morgan';
import requestIp from 'request-ip';
import { v4 as uuid } from 'uuid';

import type { Configuration } from 'webpack';

import rendererFactory, {
  type LoggerI,
  type OptionsT as RendererOptionsT,
} from './renderer';

import {
  CODES,
  ERRORS,
  getErrorForCode,
  newError,
} from './utils/errors';

export type CspOptionsT = Exclude<HelmetOptions['contentSecurityPolicy'], boolean | undefined>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface RequestT extends Request {
  cspNonce: string;
  nonce: string;
}

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
    (array) => (array as string[]).filter((item: string) => item !== 'https:'),
  ),
};
defaultCspSettings.directives['frame-src'] = [
  "'self'",

  // YouTube domain is whitelisted to allow <YouTubeVideo> component to work
  // out of box.
  'https://*.youtube.com',
];

{
  const directives = defaultCspSettings.directives['script-src'];
  if (directives) directives.push("'unsafe-eval'");
  else defaultCspSettings.directives['script-src'] = ["'unsafe-eval'"];
}

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
export function getDefaultCspSettings(): {
  directives: Record<string, string[]>;
} {
  return cloneDeep(defaultCspSettings);
}

export type ServerT = Express & {
  logger: LoggerI;
};

export type OptionsT = RendererOptionsT & {
  beforeExpressJsError?:
  (server: ServerT) => boolean | Promise<boolean>;

  beforeExpressJsSetup?: (server: ServerT) => Promise<void> | void;
  cookieSignatureSecret?: string;
  cspSettingsHook?: (
    defaultOptions: CspOptionsT,
    req: Request,
  ) => CspOptionsT;
  devMode?: boolean;
  httpsRedirect?: boolean;
  onExpressJsSetup?: (server: ServerT) => Promise<void> | void;
};

export default async function factory(
  webpackConfig: Configuration,
  options: OptionsT,
): Promise<ServerT> {
  const rendererOps: RendererOptionsT = pick(options, [
    'Application',
    'beforeRender',
    'favicon',
    'logger',
    'maxSsrRounds',
    'noCsp',
    'ssrTimeout',
    'staticCacheController',
    'staticCacheSize',
  ]);
  const renderer = rendererFactory(webpackConfig, rendererOps);
  const { publicPath } = webpackConfig.output!;

  const server = express() as ServerT;

  if (options.beforeExpressJsSetup) {
    await options.beforeExpressJsSetup(server);
  }

  if (options.logger) server.logger = options.logger;

  if (options.httpsRedirect) {
    server.use((req, res, next) => {
      const schema = req.headers['x-forwarded-proto'];
      if (schema === 'http') {
        let url = `https://${req.headers.host}`;
        if (req.originalUrl !== '/') url += req.originalUrl;
        res.redirect(url);
        return;
      }
      next();
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
    server.use(
      (req: Request, res: Response, next: NextFunction) => {
        const req2 = req as RequestT;

        req2.nonce = uuid();

        // TODO: This is deprecated, but it is kept for now for backward
        // compatibility. Should be removed sometime later.
        req2.cspNonce = req2.nonce;

        // The deep clone is necessary here to ensure that default value can't be
        // mutated during request processing.
        let cspSettings: CspOptionsT = cloneDeep(defaultCspSettings);
        (cspSettings.directives?.['script-src'] as string[]).push(`'nonce-${req2.nonce}'`);
        if (options.cspSettingsHook) {
          cspSettings = options.cspSettingsHook(cspSettings, req);
        }
        helmet.contentSecurityPolicy(cspSettings)(req, res, next);
      },
    );
  }

  if (options.favicon) {
    server.use(favicon(options.favicon));
  }

  server.use('/robots.txt', (req, res) => {
    res.send('User-agent: *\nDisallow:');
  });

  server.use(express.json({ limit: '300kb' }));
  server.use(express.urlencoded({ extended: false }));
  server.use(cookieParser(options.cookieSignatureSecret));
  server.use(requestIp.mw());

  server.use(csrf({ cookie: true }));

  loggerMiddleware.token(
    'ip',
    (req: Request & { clientIp: string }) => req.clientIp,
  );
  const FORMAT = ':ip > :status :method :url :response-time ms :res[content-length] :referrer :user-agent';
  server.use(loggerMiddleware(FORMAT, {
    stream: {
      // TODO: This implies the logger is always set. Is it on a higher level?
      // then mark it as always present.
      write: options.logger!.info.bind(options.logger),
    },
  }));

  // Note: no matter the "public path", we want the service worker, if any,
  // to be served from the root, to have all web app pages in its scope.
  // Thus, this setup to serve it. Probably, need some more configuration
  // for special cases, but this will do for now.
  server.get('/__service-worker.js', express.static(
    webpackConfig.output?.path ?? '',
    {
      setHeaders: (res) => res.set('Cache-Control', 'no-cache'),
    },
  ));

  /* Setup of Hot Module Reloading for development environment.
   * These dependencies are not used, nor installed for production use,
   * hence we should violate some import-related lint rules. */
  /* eslint-disable import/no-extraneous-dependencies */
  if (options.devMode) {
    // This is a workaround for SASS bug:
    // https://github.com/dart-lang/sdk/issues/27979
    // which manifests itself sometimes when webpack dev middleware is used
    // (in dev mode), and app modules are imported in some unfortunate ways.
    // TODO: Double-check, what is going on here.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!global.location) {
      global.location = {
        href: `${pathToFileURL(process.cwd()).href}${sep}`,
      } as Location;
    }

    const { webpack } = await import(/* webpackChunkName: "server-side-code" */ 'webpack');

    const { default: webpackDevMiddleware } = await import(
      /* webpackChunkName: "server-side-code" */ 'webpack-dev-middleware'
    );

    const { default: webpackHotMiddleware } = await import(
      /* webpackChunkName: "server-side-code" */ 'webpack-hot-middleware'
    );

    const compiler = webpack(webpackConfig);
    if (!compiler) throw Error('Internal error');

    server.use(webpackDevMiddleware(compiler, {
      publicPath,
      serverSideRender: true,
    }));
    server.use(webpackHotMiddleware(compiler));
  }
  /* eslint-enable import/no-extraneous-dependencies */

  server.use(publicPath as string, express.static(webpackConfig.output!.path!));

  if (options.onExpressJsSetup) {
    await options.onExpressJsSetup(server);
  }
  server.use(renderer);

  /* Detects 404 errors, and forwards them to the error handler. */
  server.use((req, res, next) => {
    next(newError(ERRORS.NOT_FOUND, CODES.NOT_FOUND));
  });

  let dontAttachDefaultErrorHandler;
  if (options.beforeExpressJsError) {
    dontAttachDefaultErrorHandler = await options.beforeExpressJsError(server);
  }

  /* Error handler. */
  if (!dontAttachDefaultErrorHandler) {
    // TODO: Do we need this error handler at all? It actually seems to do
    // what the default ExpressJS error handler does anyway, see:
    // https://expressjs.com/en/guide/error-handling.html
    //
    // TODO: It is better to move the default error handler definition
    // to a stand-alone function at top-level, but the use of options.logger
    // prevents to do it without some extra refactoring. Should be done sometime
    // though.
    server.use((
      error: Error & {
        status?: number;
      },
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      // TODO: This is needed to correctly handled any errors thrown after
      // sending initial response to the client.
      if (res.headersSent) {
        next(error);
        return;
      }

      const status = error.status ?? CODES.INTERNAL_SERVER_ERROR;
      const serverSide = status >= (CODES.INTERNAL_SERVER_ERROR as number);

      // Log server-side errors always, client-side at debug level only.
      options.logger!.log(serverSide ? 'error' : 'debug', error.toString());

      let message = error.message || getErrorForCode(status);
      if (serverSide && process.env.NODE_ENV === 'production') {
        message = ERRORS.INTERNAL_SERVER_ERROR;
      }

      res.status(status).send(message);
    });
  }

  return server;
}
