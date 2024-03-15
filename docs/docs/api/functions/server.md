# server()
```jsx
import { server } from '@dr.pogodin/react-utils';

server(webpackConfig, options): Promise<object>
```
Creates and launches a web-server for ReactJS application. With correct
configuration it support the server-side rendering (SSR), in-memory caching of
rendered HTML markup, Hot Module Reloading (HMR) in development environment, and
other useful stuff.

:::caution
Since [v1.19.0](https://github.com/birdofpreyru/react-utils/releases/tag/v1.19.0)
[CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) protection is
enabled by default for all HTTP methods of created server, beside `GET`, `HEAD`,
and `OPTIONS`. It is implemented using [@dr.pogodin/csurf] middleware with
[double submit cookie method](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie).
The CSRF Token is injected into the client-side [config] under `SCRF` key,
and its value should be included into all requests to protected endpoints,
using one of the default methods listed in [@dr.pogodin/csurf] documentation (_e.g._ as
`_csrf` value of `POST` body, or query).

Note, CSRF Token is not injected into the server side [config], and it is not
supposed to be used during SSR, as doing so would complicate
[server-side caching of rendered pages][staticCacheController()].
:::

## Examples

### Simple server
```jsx title="Starting a simple ReactJS server (without SSR)."
import { server } from '@dr.pogodin/react-utils';
import webpackConfig from '/path/to/the/project/webpack.config';

// This creates and launches a simple ReactJS server,
// which serves the app defined by the provided "webpackConfig".
server(webpackConfig);
```

## Arguments
- `webpackConfig` - **object** - [Webpack] configuration used to build
  the frontend bundle. In production mode the server will read out of it
  **context**, **publicPath**, and some other parameters, necessary to locate
  and serve the app bundle. In development mode the server will use entire
  provided config to build the app bundle in memory, and further watch and
  update it via HMR.
- `options` - **object** - Optional configuration object. The valid fields are:
  - `Application` - **React.Component** - The root component of ReactJS app
    to use for SSR; without it SSR is disabled.
  - [beforeExpressJsError](#beforeexpressjserror) - **callback** triggered just
    before the default error handler is attached to the created [ExpressJS]
    server, and it can be used to customize the error handling, and opt-out of
    the default error handler.
  - [beforeExpressJsSetup](#beforeexpressjssetup) - **callback** triggered right
    after [ExpressJS] server creation, before any of its configuration
    is peformed, and it can be used to perform some custom server configuration
    at that point.

  - <Link id="arguments-beforerender" />
    [beforeRender][beforeRender()] - **callback** triggered in the beginning of
    server-side rendering for each incoming request just before the HTML markup
    is generated. It allows to load and provide data necessary for SSR, and also
    to inject additional config and scripts into the rendered HTML code.

  - `buildInfo` - **object** - Optional. The "[build info]" object to use.
    Without this option provided it will be loaded from the `.build-info` file
    in the "context" folder of the Webpack build being served.
  - `noCsp` - **boolean** - Disables [CSP] altogether.
  - [cspSettingsHook](#cspsettingshook) - **callback** allowing to customize
    [CSP] headers managed by the [helmet]'s `contentSecurityPolicy`
    middleware on per-request basis.
  - `defaultLoggerLogLevel` - **string** - Log level for the default logger,
    which is created and used if no `logger` option is provided. Defaults to
    `info`.
  - `devMode` - **boolean** - Turns on development server mode.
  - `favicon` - **string** - Path to the favicon to server by the server.
    By default no favicon is served.

  - `https` &mdash; **object** &mdash; If provided, HTTPS server will be created instead of
    the default HTTP one. The object should provide SSL sertificate and key via
    two string fields of the object: `cert`, and `key`.

  - `httpsRedirect` &mdash; **boolean** &mdash; Enables automatic redirection of
    incoming HTTP requests to HTTPS protocol. Defaults _true_.

    To smoothly use it for local development you need to run the server in HTTPS
    mode (see the `https` option above) and also properly create and install
    a self-signed SSL certificate onto your system. See this article for details:
    [How to get HTTPS working on your local development environment in 5 minutes](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec).

  - `logger` - **object** - The server side logger. By default
    [winston](https://www.npmjs.com/package/winston) logger with console
    transport is used. Provided logger, or the default **winston** logger,
    is attached to the created [ExpressJS] server object.
  - [onExpressJsSetup](#onexpressjssetup) - **callback** triggered when the most
    of server configuration is completed, and just before the server-side renderer
    and the default error handler are attached. It can be used to mount custom
    API routes to the server.
  - `port` - **number | string** - The port to start the server. Defaults to
    `3000`.
  - `staticCacheSize` - **number** - The maximum static cache size [bytes].
    Defaults ~10 Mb.
  - [staticCacheController](#staticcachecontroller) - **callback** which
    activates and controls the static caching of generated HTML markup.
  - `maxSsrRounds` - **number** - Maximum number of SSR rounds. Defaults `10`.
  - `ssrTimemout` - **number** - SSR timeout [ms]. Default 1000ms.

## Result
Returns a **Promise** which resolves to an object with two fields:
- `expressServer` - **object** - Created [ExpressJS] server.
- `httpServer` - **object** - Created HTTP(S) server.

## Definitions

### beforeExpressJsError()
```jsx
function beforeExpressJsError(server): Promise<boolean>
```
The signature for [server()]'s `beforeExpressJsError` option.

**Arguments**
- `server` - **object** - The [ExpressJS] server being created.

Returns **Promise**:
- If resolves to a **falsy** value [server()] won't attach the default
  error handler to the created [ExpressJS] server.
- If resolves to a **truthy** value [server()] will attach the default
  error handler to the created [ExpressJS] server right after the callback
  result resolution.

### beforeExpressJsSetup()
```jsx
function beforeExpressJsSetup(server)
```
The signature for [server()]'s `beforeExpressJsSetup` option is:

**Arguments**
- `server` - **object** - The [ExpressJS] server being created.

### beforeRender()
```jsx
function beforeRender(req, config): Promise<object>
```
The signature for [server()]'s `beforeRender` option.

**Arguments**
- `req` - **object** - Incoming [ExpressJS] HTTP reques, with some extra fields
  attached:
  - `nonce` - **string** - [CSP] nonce for `<script>` tags, which should
    be added to script tags injected into the page to whitelist their execution
    when [CSP] is enabled.
- `config` - **object** - The application config that server wants to inject
  into the generated HTML template (and thus into the client-side environment).

Returns **Promise**: it should resolve to an object that may have the following
optional fields:
- `configToInject` - **object** - The config object to inject into
  the client-side environment instead of the `config` suggested by the server.
- `extraScripts` - **Array&lt;[Script] | string&gt;** -
  An array of additional scripts to inject into the generated page. It may
  contain a mix of strings and [Script] objects. For each script given as
  a string that string is injected as is in the end of the generated
  document's `<body>`, just before the main application bundle. For each
  script given as [Script] object the payload is injected into the specified
  document location. In either case, the scripts intended for the same
  location are injected in the order they are encountered in the `extraScripts`
  array.
- `initialState` - **object** - The initial [global state](/docs/api/utils/react-global-state) value.

### cspSettingsHook()
```jsx
function cspSettingsHook(defaultSettings, req): object
```
The signature for [server()]'s `cspSettingsHook` option.

**Arguments**
- `defaultSettings` - **object** - Default [CSP] settings (see below) that would
  be used without this callback provided.
- `req` - **object** - The incoming [ExpressJS] HTTP request.

Returns **object**: The options to pass into the [helmet]'s `contentSecurityPolicy`
middleware.

Currently the default [CSP] settings used in the production environment are:
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
    upgradeInsecureRequests: [], // Removed in dev mode.
  },
}
```
They match the default [helmet] settings for [CSP] with just a few changes:
- YouTube host is whitelisted in the `frameScr` to ensure
  [YouTubeVideo] component can work.
- An unique per-request nonce is added to the `scriptSrc` directive to
  whitelist auxiliary scripts injected by **react-utils**. The actual nonce
  value can be accessed by the host code as `req.nonce` field inside
  the [server()]'s [beforeRender()](#beforerender) hook (_e.g._ to add it
  to custom scripts injected by the host code).
- `upgradeInsecureRequests` directive is removed in development mode
  to simplify local development without HTTPS setup.

### onExpressJsSetup()
```jsx
function onExpressJsSetup(server): Promise
```
The signature for [server()]'s `onExpressJsSetup` option.

**Arguments**
- `server` - **object** - The [ExpressJS] server being created. You can access
  created server-side logger as `server.logger`.

Returns **Promise**: It will be awaited before [server()] continues with the setup.

### Script {#beforerender-script}
Describes a custom script to inject into the rendered HTML. It is intended for
[beforeRender()] output. A valid [Script] object has two fields:
- `code` - **string** - The HTML code to inject into the specified location of
  the generated HTML markup.
- `location` - [SCRIPT_LOCATIONS] - One of the script location values.

### staticCacheController()
```jsx
function staticCacheController(req): object
```
The signature for [server()]'s `staticCacheController` option.

When provided this function is called for each incoming request, and server
attempts to find in its internal cache a record stored under the `key` returned
by this function. Assuming it is found, and does not violate `maxage`, the cached
HTML is returned by the server. Otherwise HTML markup is generated from scratch
for the request, and stored into the cache under the given `key` for future
reuse.

:::caution WARNING
If during SSR some component writes **5xx** value into `.status` field of
**ssrContext** (see [getSsrContext()]) the generated HTML markup won't be
cached, no matter the result of [staticCacheController()] call.
:::

**Arguments**
- `req` - **object** - The incoming [ExpressJS] HTTP request.

Returns **object** with the following fields:
  - `key` - **string** - The cache key for this request/response.
  - `maxage` - **number** - Optional. Maximum age [ms] of the cached result.
    Defaults to unlimited maxage.

[beforeRender()]: #beforerender
[build info]: /docs/api/configs/webpack#build-info
[config]: /docs/api/utils/config
[CSP]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
[@dr.pogodin/csurf]: https://www.npmjs.com/package/@dr.pogodin/csurf
[ExpressJS]: https://expressjs.com
[helmet]: https://github.com/helmetjs/helmet
[getSsrContext()]: https://dr.pogodin.studio/docs/react-global-state/docs/api/hooks/getssrcontext
[http-status-codes]: https://www.npmjs.com/package/http-status-codes
[Joi]: https://joi.dev/api/?v=17.4.2
[Script]: #beforerender-script
[SCRIPT_LOCATIONS]: /docs/api/utils/server#script_locations
[server()]: /docs/api/functions/server
[staticCacheController()]: /docs/api/functions/server#staticcachecontroller
[YouTubeVideo]: /docs/api/components/youtubevideo
[Webpack]: https://webpack.js.org
