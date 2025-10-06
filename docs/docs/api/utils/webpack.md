# webpack
```jsx
import { webpack } from '@dr.pogodin/react-utils';
```
Encapsulates Webpack-related utilities.

**Functions**
- [requireWeak()] - Requires a module at server side, and prevents it from being
  bundled by Webpack.
- [resolveWeak()](#resolveweak) - Resolves a module path with the help of
  Babel module resolver, thus the same way the resolution works for the normal
  `require()`.

## Functions

### requireWeak()
```tsx
import { webpack } from '@dr.pogodin/react-utils';

type RequireWeakOptionsT = {
  basePath?: string;
  throwOnError?: boolean;
};

webpack.requireWeak<Module extends NodeJS.Module>(
  modulePath: string,
  basePathOrOptions?: RequireWeakOptionsT | string,
): Module | null;
```
Implements server-side loading of the specified JS module in the way which
prevents it from being bundled into the client-side code by Webpack.

- **Server-side**: the `modulePath` argument is processed by Babel module
  resolver; if `basePath` is given, the resulting module path is additionally
  resolved from the base path using [path.resolve()]; the module is then loaded
  from the resulting path, and returned, similar to the regular `require()`, but
  invisible to Webpack, hence the module required this way is not bundled into
  the client side code. If the module could not be resolved, or the loading
  failed for other reason, [requireWeak()] returns **null**.

- **Client-side**: always returns **null**.

:::info Changes across `dr.pogodin/react-utils` versions:
- **v1.44.10**:
  Turns the second, optional argument into an object with `basePath` and
  `throwOnError` options. In past versions this optional argument was just
  `basePath` string, which still works but will be deprecated in future
  version.

- **v1.40.11**:
  - **TypeScript**: Added `Module` generic argument for typing of the result.
    You want to use it like:
    ```tsx
    import type M from 'some-module';

    const m = webpack.requireWeak<typeof M>('some-module');
    ```
- **v1.14.0**:
  - Safe to call at the client side, and always returns **null** there.
  - The `modulePath` argument is automatically processed by Babel module resovler.
  - `basePath` argument introduced.
:::

### resolveWeak()
```jsx
webpack.resolveWeak(modulePath): string
```
Resolves `modulePath` module path with the help of Babel module resolver,
thus the same way the resolution works for the normal `require()`.

**Arguments & Result**
- `modulePath` - **string** - Module path.
- Returns **string** - The resolved relative path to the module.

<!-- Reusable links. -->
[path.resolve()]: https://nodejs.org/dist/latest-v16.x/docs/api/path.html#pathresolvepaths
[requireWeak()]: #requireweak
