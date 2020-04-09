# Isomorphy

```js
import { isomorphy } from '@dr.pogodin/react-utils';
```

A good ReactJS code is isomorphic, it works correctly both client- (browser),
and server-side (NodeJS). Sometimes it requires explcit environment checks to
provide different functionality implementation for client and server.
This module provides necessary functions.

- [`isomorphy` reference](#reference)
  - [`.assertClientSide()`](#assertClientSide)
  - [`.assertServerSide()`](#assertServerSide)
  - [`.buildTimestamp(): string`](#buildTimestamp)
  - [`.isClientSide(): boolean`](#isClientSide)
  - [`.isDevBuild(): boolean`](#isDevBuild)
  - [`.isProdBuild(): boolean`](#isProdBuild)
  - [`.isServerSide(): boolean`](#isServerSide)

**Important**

- All functionality in this module relies on React Utils configuration, client
  initialization, and server code being used in your project.

- [`isDevBuild()`](#isDevBuild) and [`isProdBuild()`](#isProdBuild) functions
  return dev/prod mode of the
  currently executed code. While the server launched in dev mode always serve
  dev version of the frontend code, the server launched in prod mode can serve
  either prod, or dev versions of the code, depending on which of them was build
  before by the caller. Note that the mode depends on the value `BABEL_ENV`
  environment variable (at the build time, for the front-end code; or at
  the present time, for the server-side code). `NODE_ENV` variable, in turn,
  defines the runtime environment, which can be configured via
  [`config`](./config-utils.md).

### Reference

- <a name="assertClientSide"></a>
  `.assertClientSide()` &ndash; Throws error if called outside the client-side
  environment.

- <a name="assertServerSide"></a>
  `.assertServerSide()` &ndash; Throws error if called outside the server-side
  environment.

- <a name="buildTimestamp"></a>
  `.buildTimestamp(): string` &ndash; Returns build timestamp of the frontend JS
  bundle, in form of ISO date/time string. At the server-side it will be the
  timestamp of bundle being served by the server.

- <a name="isClientSide"></a>
  `.isClientSide(): boolean` &ndash; Returns `true` if executed at the client
  side (in browser), `false` otherwise.

- <a name="isDevBuild"><a/>
  `.isDevBuild(): boolean` &ndash; Returns `true` if development version of
    the code is running, `false` otherwise.

- <a name="isProdBuild"></a>
  `.isProdBuild(): boolean` &ndash; Returns `true` if the production version
    of code is running, `false` otherwise.

- <a name="isServerSide"></a>
  `.isServerSide(): boolean` &ndash; Returns `true` if executed at
  the server side (NodeJS), `false` otherwise.
