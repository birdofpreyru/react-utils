# isomorphy
```js
import { isomorphy } from '@dr.pogodin/react-utils';
```
The [isomorphy] module is a collection of helpers for dealing with isomorphic
aspects of code (mostly environment checks: client- or server-side, development
or production, _etc._). All [constants](#constants) and [methods](#methods)
documented below are exposed as key values of `isomorphy` object.

:::caution Beware
This module relies on [Babel](/docs/api/configs/babel) and
[Webpack](/docs/api/configs/webpack) configurations provided
by **react-utils** library being used by the host code, along with provided
mechanics for server creation and client-side app initialization. It won't
work correctly with a different app setup.
:::

## Constants
- `isomorphy.IS_CLIENT_SIDE` - **boolean** - equals **true** within the client-side
  (browser) environment, and equals **false** at the server-side (NodeJS).
- `isomorphy.IS_SERVER_SIDE` - **boolean** - equals **true** within the server-side
  (NodeJS) environment, and equals **false** at the client-side (browser).

## Methods
- [buildTimestamp()](#buildtimestamp) - Returns the build timestamp of
  the frontend JS bundle.
- [getBuildInfo()](#getbuildinfo) - Returns the build info object.
- [isDevBuild()](#isdevbuild) - Returns **true** if the development version of
  code is running.
- [isProdBuild()](#isprodbuild) - Returns **true** if the production version of
  code is running.

### buildTimestamp()
```jsx
isomorphy.buildTimestamp() => string
```
Returns **string**: the build timestamp of the frontend JS bundle in ISO format.

### getBuildInfo()
```jsx
isomorphy.getBuildInfo() => object
```
Returns **object**: the build info object.

### isDevBuild()
```jsx
isomorphy.isDevBuild() => boolean
```
Returns **boolean**: **true** if the development version of code is running,
**false** otherwise.

### isProdBuild()
```jsx
isomorphy.isProdBuild() => boolean
```
Returns **boolean**: **true** if the production version of code is running,
**false** otherwise.

[Isomorphy]: /docs/api/utils/isomorphy
