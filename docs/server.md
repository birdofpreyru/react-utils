# Web Server for ReactJS App

```js
import { server } from '@dr.pogodin/react-utils`;
import webpackConfig from 'path/to/your/webpack.config';

server(webpackConfig);

/* Web server is up, running, and serving the app specified by the provided
 * Webpack config */
```

All you need to create and launch a web-server for your ReactJS application.
Allows zero or detailed configuration, supports server-side rendering, and
development tools, including Hot Module Reloading (HMR).

### Reference

- `async server(webpackConfig, [options])` &rArr; `Promise` &rArr;
  `{ expressServer, httpServer }`

  **Arguments**

  - `webpackConfig` (_Object_) &ndash; Webpack configuration used to build
    the frontend bundle. In production mode the server will read out of it
    `context`, `publicPath`, and a few other parameters, necessary to locate
    and serve the app bundle. In development mode the server will use entire
    provided config to build the app bundle in memory, and further watch and
    update it via HMR.

  - `[options]` (_Object_) &ndash; Optional. Additional parameters.

  - `[options.Application]` (_Component_) &ndash; Optional. The root ReactJS
    component of the app to use for the server-side rendering. When not provided
    the server-side rendering is disabled.

  - `options.beforeExpressJsError?: (server) => Promise<boolean>?` &ndash;
    Optional. An async callback to be executed just before the default error
    handler is added to ExpressJS server. If the callback is provided and its
    result resolves to a truly value, `react-utils` won't attach the default
    error handler.

  - `options.beforeExpressJsSetup?: (server) => Promise?` &ndash; Optional.
    An async callback to be executed right after ExpressJS server creation,
    bofore any configuration is performed.

  - `[options.beforeRender]` ([_Before Render Hook_](#before-render-hook))
    &ndash; Optional. The hook to run just before the server-side rendering.
    For each incoming request, it will be executed just before the HTML markup
    is generated at the server. It allows to load and provide the data necessary
    for server-side rendering, and also to inject additional configuration and
    scripts into the generated HTML code.

  - `[options.cspSettingsHook: function]` &ndash; Optional. A hook allowing
    to customize [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
    settings for [helmet](https://github.com/helmetjs/helmet)'s
    `contentSecurityPolicy` middleware on per-request basis.

    If provided it should be a with signature: \
    `(defaultSettings: object, req: object)` &rArr; `object` \
    which gets the default settings (also used without the hook),
    and the incoming request object. The hook response will be passed
    as options to the helmet `contentSecurityPolicy` middleware.

    Currently, the default settings is the following object in production
    environment:
    ```js
    {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        blockAllMixedContent: [],
        fontSrc: ["'self'", 'https:', 'data:'],
        frameAncestors: ["'self'"],
        frameSrc: ["'self'", 'https://*.youtube.com'],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", "'unsafe-eval'", `'nonce-UNIQUE_NONCE_VALUE'`],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        upgradeInsecureRequests: [] // Removed in dev mode.
      }
    }
    ```
    It matches the default value used by Helmet with a few updates:
    - YouTube host is whitelisted in the `frameSrc` directive to ensure
      the [`<YouTubeVideo>`](./YouTubeVideo.md) component works.
    - An unique per-request nonce is added to `scriptSrc` directive to
      whitelist auxiliary scripts injected by react-utils. The actual nonce
      value can be fetched by host code via `.cspNonce` field of `req` argument
      of `.beforeRender` hook.
    - `upgradeInsecureRequests` directive is removed in development mode,
      to simplify local testing with http requests.

  - `options.defaultLoggerLogLevel = 'info'` &ndash; Optional. Log level for
    the default logger, which is created if no `logger` option provided.
    Defaults to `info`.

  - `[options.devMode]` (_Boolean_) &ndash; Optional. Pass in `true` to start
    the server in development mode.

  - `[options.favicon]` (_String_) &ndash; Optional. Path to the favicon to use
    by the server. By default no favicon is used.

  - `[options.https]` (_Object_) &ndash; Optional. If provided, HTTPS server
    will be started, instead of HTTP otherwise. The object should provide SSL
    certificate and key via two string fields: `cert`, and `key`.

  - `[options.httpsRedirect]` (_Boolean_) &ndash; Optional. Pass in `true`
    to enable automatic redirection of all incoming HTTP requests to HTTPS.

    To smoothly use it at `localhost` you need to run the server in HTTPS mode,
    and also properly create and install a self-signed SSL sertificate on your
    system. This article is helpful:
    [How to get HTTPS working on your local development environment in 5 minutes](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec)

  - `options.logger?: Logger` &ndash; Optional. The logger to use at server
    side. By default [`winston`](https://www.npmjs.com/package/winston) logger
    with console transport is used. The logger you provide, or the default
    `winston` logger otherwise, will be attached to the created ExpressJS server
    object.

  - `options.onExpressJsSetup?: (server) => Promise?` (_Function_) &ndash;
    Optional. An async callback to be triggered when most of the server
    configuration is completed, just before the server-side renderer,
    and the default error handler are attached. You can use it to mount
    custom API routes. The server-side logger can be accessed as `server.logger`.

  - `[port]` (_Number_ or _String_) &ndash; Optional. The port to start
    the server on. Defaults **3000**.

  **Returns** `Promise`resolving to the object with fields

  - `expressServer` (_Object_) &ndash; Created ExpressJS server, with
    the provided, or default logger attached as `expressServer.logger`.

  - `httpServer` (Object) &ndash; Created HTTP(S) server.

- <a name="before-render-hook"></a>
  `async beforeRenderHook(req, config)` &rArr; `Promise` &rArr;
  `{ configToInject, extraScripts, store }`

  **Arguments**

  - `req` (_Object_) &ndash; Incoming ExpressJS HTTP request, with some extra
    fields attached:

    - `.cspNonce: string` &ndash; CSP nonce for `<script>` tags, which should be
      added to the tags injected into the page to allow them to work.

  - `config` (_Object_) &ndash; Application config that server wants to
    inject into generated HTML template.

  **Returns** `Promise` resolving to the object with fields
  
  - `[configToInject]` (_Object_) &ndash; Optional. The actual config object to
    inject into the generated page. If not provided, the `config` provided as
    argument will be injected as is.

  - `[extraScripts]` (_Array of Objects and/or Strings_) &ndash; Optional.
    Additional scripts to inject into the generated page. Each script given
    as a string will be injected as is in the end of generated document's
    `<body>`, just before the main application bundle. Each script given as
    an object is expected to have two fields: `code` holding the actual code
    to inject, and `location` specifying where to inject that `code`. The valid
    locations are exposed via
    the [`server.SCRIPT_LOCATIONS`](#script-locations) object. The scripts
    intended for the same location are injected in the order they are listed
    in the `extraScript` array.

  - `[initialState]` (_Object_) &ndash; Optional. Initial value of the global state.

- <a name="script-locations"></a> `server.SCRIPT_LOCATIONS`
  
  - `server.SCRIPT_LOCATIONS.BODY_OPEN` &ndash; Right after the opening `<body>`
    tag.
  - `server.SCRIPT_LOCATIONS.DEFAULT` &ndash; In the end of `<body>` block, just
    before the main application bundle.
  - `server.SCRIPT_LOCATIONS.HEAD_OPEN` &ndash; Right after the opening `<head>`
    tag.
