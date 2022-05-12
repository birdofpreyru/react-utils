# E2eSsrEnv
```jsx
import E2eSsrEnv from '@dr.pogodin/react-utils/jest-e2e-ssr-env';

// Alternatively, within an actual Jest test:
/** @jsdom-environment @dr.pogodin/react-utils/jest-e2e-ssr-env */
```
The [E2eSsrEnv] class implements a
[Jest test environment](https://jestjs.io/docs/configuration#testenvironment-string)
for end-to-end testing of SSR and client-side execution of Webpack-built code.
It should be considered as a part of [Jest utilities][JU] provided by the library,
but due to technical reasons it cannot be exported directly from [JU] sub-module,
and should stay as a separate library export.

Given a source ReactJS code, a Webpack config factory, and additional options,
it bundles the application code with Webpack, emitting output assets into
in-memory filesystem, it then generates server-side (SSR) markup for
the specified request, and provides client-side ([JsDom]) environment
for Jest testing with outcomes of Webpack build and SSR exposed via
global variables.

The environment and its options are configured in a Jest test via pragmas
in the opening docblock, _e.g._:

```jsx
/**
 * @jest-environment @dr.pogodin/react-utils/jest-e2e-ssr-env
 * @webpack-config-factory @dr.pogodin/react-utils/config/webpack/app-production.js
 * @webpack-config-options { "entry": "./path/to/webpack-entry.js" }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./path/to/Scene.jsx" }
 */
```

[Real-life examples of using this test environment](https://github.com/birdofpreyru/react-utils/tree/master/__tests__/config/stylename-generation)
(these examples are within react-utils library codebase, because of this they
import the environment with the pragma
`@jest-environment ./src/shared/utils/jest/E2eSsrEnv.js` using a local path).

## Configuration
The following docblock pragma parameters are recognized by the environment:
- `@webpack-config-factory PATH` - The path to [Webpack config factory] to
  use for the build. If `PATH` is relative, it is resolved relative to the root
  directory of Jest configuration.

- `@webpack-config-options OBJECT` - The options object to pass into
  [Webpack config factory]. The environment will automatically set this object's
  `.context` field to the current test's folder, and a new [memfs] in-memory
  filesystem will be created and provided via `.fs` option.
  You want to set `.entry` field to point to the tested app entry
  point (which should include the mounting of the app into DOM, _e.g._ by
  calling to the [client()] function).

  When [development config factory](/docs/api/configs/webpack#app-dev) is used
  you probably want to set **true** `.dontUseHmr` and
  `.dontUseReactGlobalStateDebugging` flags to avoid polluting test logs with
  logging from React Global State, and avoid problems with HMR incompatible
  with Jest testing setup without extra efforts.

  :::info CHANGELOG
  In the library versions **v1.17.2** &div; **v1.17.4** `.dontEmitBuildInfo`
  flag was automatically set **true**. Since **v1.17.5** the `.fs` option is
  used instead to collect in a virtual filesystem artifacts created during
  the Webpack config generation.
  :::

- `@ssr-options OBJECT` - The options for SSR rendering. The object is passed
  into the standard [server()] factory, but there are a few special fields
  accepted within this object by the environment:
  - `.babelEnv` - **string** - Optional. Allows to enforce the correct Babel
    environment for SSR in the test. _e.g._ "**development**" or "**production**".
  - `.buildInfo` - **object** - Optional. Allows to enforce specific
    "[build info]" data to be used in SSR.
  - `.entry` - **string** - The path to app entry to use in SSR. You want to
    have it different from Webpack's entry point, as it should not include
    the app mounting into DOM ([client()] call). Typically, you want the entry
    point for Webpack to be a thin wrapper module around this entry point for SSR.

    The environment will use this path to automatically set `.Application`
    field to the root application component to render.

    If relative path is provided, it is resolved relative to the test folder.
  - `.entryExportName` - **string** - By default `.Application` option is set
    based on the "**default**" export from the module pointed by `.entry` path.
    When this field is set, the corresponding named export is used instead.

  - `.root` - **string** - By default, SSR runs with the current working
    directory, `process.cwd()`,
    as the [Babel's root](https://babeljs.io/docs/en/options#root),
    where default configuration files for Babel are looked up.
    This option allows to alter it. It currently accepts a single valid value:
    - "`TEST`" - To use the current test folder as the root.

      :::tip TIP
      You may want to use this option to place a custom `babel.config.json` file
      into the test folder. Mind that to completely override Babel settings for
      the tested codebase, you probably should set to **false**
      the [babelrc](https://babeljs.io/docs/en/options#babelrc) flag
      in that  `babel.config.json`  config.
      :::

- `@ssr-request OBJECT` - Optional. The request object to use for SSR,
  _e.g._ to provide a custom `url`.

- `@no-ssr true` - Set this to opt out of SSR, if only Webpack build is
  needed for the test.

## Outputs
The environment exposes outcomes of the Webpack build and SSR rendering to
the actual test runtime via the following global variables:
- `buildInfo` - **object** - The "[build info]" object from the Webpack build.
- `dom` - **object** - The instance of [JsDom] object. For example, you may
  use its `.reconfigure()` method to change URL being used by the client-side.
- `REACT_UTILS_FORCE_CLIENT_SIDE` - **boolean** - This global flag is
  automatically set **true** to force-emulate the client-side execution
  for React Utils library within the environment.
- `ssrMarkup` - **string** - HTML markup generated by SSR.
- `ssrOptions` - **object** - Options used by SSR.
- `ssrStatus` - **number** - HTTP status code generated during SSR rendering.
- `webpackConfig` - **object** - The config generated by the provided config
  factory and used for the Webpack build.
- `webpackOutputFs` - **object** - The in-memory filesystem ([memfs] instance)
  with outputs from the Webpack build.
- `webpackStats` - **object** - [Webpack stats](https://webpack.js.org/api/stats/)
  from the Webpack build, converted to JSON format.

## Hints
Within the Jest test using [E2eSsrEnv] you may use the following code patterns
to test SSR and Webpack-build outcomes.

```jsx
/**
 * @jest-environment @dr.pogodin/react-utils/jest-e2e-ssr-env
 * @webpack-config-factory @dr.pogodin/react-utils/config/webpack/app-development.js
 * @webpack-config-options {
 *  "entry": "./path/to/webpack-entry.js",
 *  "dontUseHmr": true,
 *  "dontUseReactGlobalStateDebugging": true }
 * @ssr-options { "entry": "./path/to/Scene.jsx" }
 */
// Above is a sample docblock comment configuring the environment with
// our standard development config for Webpack.

// This is needed to emulate client-side hydration further below.
import { act } from 'react-dom/test-utils';

// The path for Webpack outputs within the in-memory filesystem.
const outputPath = global.webpackConfig.output.path;

// Information on Webpack outputs by bundle chunk names.
const { namedChunkGroups } = global.webpackStats;

// Listing the content of Webpack output folder.
const fs = global.webpackOutputFs;
console.log(fs.readdirSync(outputPath));

// Mounting the SSR-generated markup into DOM.
// You may need document.open() and document.close() calls if you are
// to remount the document.
document.write(global.ssrMarkup);

// This is the container of the main application content,
// if your rely on the standard client() function from the library.
const container = document.querySelector('#react-view');

// To emulate the client-side execution (hydration), you need to do
// the following within a test. The following example assumes we use
// the standard development config factory for the Webpack build,
// which guarantees the main JS bundle file is called "main.js"
// (in case of production config the filename should be found
// within Webpack build stats).
it('sample test', async ()= > {
  // This is the main app content originating from the SSR.
  const markup = container.innerHTML;

  // This does the client-side hydration.
  const js = fs.readFileSync(`${outputPath}/main.js`, 'utf8');
  await act(new Function(js)); // eslint-disable-line no-new-func

  // This checks the outcome of the client-side hydration matches the original
  // SSR markup. Note: if hydration fails, the React automatically prints out
  // the error message, but that message is not automatically caught and reported
  // by the test. If you need to fail the test on hydration failure, you should
  // do the following check.
  expect(document.querySelector('#react-view').innerHTML).toBe(markup);
});
```

<!-- links -->
[build info]: /docs/api/configs/webpack#build-info
[client()]: /docs/api/functions/client
[E2eSsrEnv]: /docs/api/classes/E2eSsrEnv
[JsDom]: https://github.com/jsdom/jsdom
[JU]: /docs/api/utils/jest-utils
[memfs]: https://www.npmjs.com/package/memfs
[server()]: /docs/api/functions/server
[Webpack config factory]: /docs/api/configs/webpack
