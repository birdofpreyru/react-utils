# Isomorphy

```js
import { isomorphy } from '@dr.pogodin/react-utils';
```

A good ReactJS code is isomorphic, it works correctly both client- (browser),
and server-side (NodeJS). Sometimes it requires explcit environment checks to
provide different functionality implementation for client and server.
This module provides necessary functions.

- [`isomorphy` reference](#reference)
  - [`.IS_CLIENT_SIDE: boolean`](#is_client_side)
  - [`.IS_SERVER_SIDE: boolean`](#is_server_side)
  - [`.assertClientSide()`](#assertClientSide)
  - [`.assertServerSide()`](#assertServerSide)
  - [`.buildTimestamp(): string`](#buildTimestamp)
  - [`.isDevBuild(): boolean`](#isDevBuild)
  - [`.isProdBuild(): boolean`](#isProdBuild)
  - **Deprecated** [`.isClientSide(): boolean`](#isClientSide)
  - **Deprecated** [`.isServerSide(): boolean`](#isServerSide)

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

- <a name="is_client_side"></a>
  `.IS_CLIENT_SIDE: boolean` &ndash; Equals `true` outside NodeJS environment.

- <a name="is_server_side"></a>
  `.IS_SERVER_SIDE: boolean` &ndash; Equals `true` inside NodeJS environment.

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

- <a name="isDevBuild"><a/>
  `.isDevBuild(): boolean` &ndash; Returns `true` if development version of
    the code is running, `false` otherwise.

- <a name="isProdBuild"></a>
  `.isProdBuild(): boolean` &ndash; Returns `true` if the production version
    of code is running, `false` otherwise.

- <a name="isClientSide"></a>
  **Deprecated** `.isClientSide(): boolean` &ndash; Returns
  [`.IS_CLIENT_SIDE: boolean`](#is_client_side) value.

- <a name="isServerSide"></a>
  **Deprecated** `.isServerSide(): boolean` &ndash; Returns
  [`.IS_SERVER_SIDE: boolean`](#is_server_side) value.
