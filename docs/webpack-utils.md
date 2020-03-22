# Webpack

Webpack-related utilities.

```js
import { webpack } from '@dr.pogodin/react-utils';
```

`webpack` object exposes the following methods as its fields:

- [`requireWeak(module: string)` &rArr; `object`](#require-weak)
- [`resolveWeak(modulePath: string)` &rArr; `string`](#resolve-weak)

### Reference

- <a name="require-weak"></a>`requireWeak(module: string)` &rArr; `object` \
  Requires specified module weakly: the module is not bundled by Webpack,
  and it is required dynamically when this function is executed.

- <a name="resolve-weak"></a>`resolveWeak(modulePath: string)` &rArr; `string` \
  Resolves given module path.
