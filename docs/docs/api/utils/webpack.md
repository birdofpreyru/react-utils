# webpack
```jsx
import { webpack } from '@dr.pogodin/react-utils';
```
Encapsulates Webpack-related utilities.

**Functions**
- [requireWeak()](#requireweak) - Requires a module preventing it from being
  bundled into the client-side code by Webpack.
- [resolveWeak()](#resolveweak) - Resolves a module path with the help of
  Babel module resolver, thus the same way the resolution works for the normal
  `require()`.

## Functions

### requireWeak()
```jsx
webpack.requireWeak(modulePath): object
```
Require the module at `modulePath` preventing it from being bundled into
the client-side code by Webpack.

:::caution Beware
Avoid passing in relative paths: they will be resolved relative to the library
distribution folder, which is wrong in most cases. To convert a relative path
to the absolute one without breaking the client-side code due to leaking
server-side-only functions to the frontend follow this:

**Example**
```jsx
import { isomorphy, webpack } from '@dr.pogodin/react-utils';

// This block executes at the server-side only.
let serverSideOnlyModule;
if (isomorphy.IS_SERVER_SIDE) {
  // webpack.requireWeak() ensures that server-side only modules, like NodeJS
  // "path" and dummy "server-side-only-module" are not bundled in into
  // the client-side code compiled by Webpack.
  const path = webpack.requireWeak('path');

  // The first line is needed only if additional Babel module resolution is
  // needed to find the given module path.
  const relPath = webpack.resolveWeak('path/to/server-side-only-module');

  // This turns a relative path into the absolute one.
  const absPath = path.resolve(__dirname, relPath);

  serverSideOnlyModule = webpack.requireWeak(p);
}
```
:::

**Arguments & Result**
- `modulePath` - **string** - Absolute path to the module to load.
- Returns **object** - Loaded module.

### resolveWeak()
```jsx
webpack.resolveWeak(modulePath): string
```
Resolves `modulePath` module path with the help of Babel module resolver,
thus the same way the resolution works for the normal `require()`.

**Arguments & Result**
- `modulePath` - **string** - Module path.
- Returns **string** - The resolved relative path to the module.
