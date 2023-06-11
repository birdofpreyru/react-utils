---
sidebar_class_name: deprecated
---

# CodeSplit

:::danger DEPRECATED
The [CodeSplit] component was deprecated, and removed from the library
in the release [v1.14.0](https://github.com/birdofpreyru/react-utils/releases/tag/v1.14.0).
Use the [splitComponent()] function instead
to implement the code splitting. To migrate replace every use of [CodeSplit] in
your code the following way.

**Original code using [CodeSplit]:**
```jsx
// WrappedSampleComponent.jsx

import { CodeSplit } from '@dr.pogodin/react-utils';

export default function WrappedSampleComponent(props) {
  return (
    <CodeSplit
      chunkName="sample-component"
      getComponentAsync={
        () => import(
          /* webpackChunkName: 'sample-component' */ 'path/to/SampleComponent'
        )
      }
      getComponentServer={
        (resolveRequire) => resolveRequire(__dirname, 'path/to/SampleComponent');
      }
      placeholder={() => <div>Optional Placeholder</div>}
      {...props}
    />
  );
}
```

**Equivalent code using [splitComponent()]:**

_Note: this code is valid for library versions from [v0.16.0](https://github.com/birdofpreyru/react-utils/releases/tag/v1.16.0) and above._
```jsx
// WrappedSampleComponent.jsx

import { splitComponent, webpack } from '@dr.pogodin/react-utils';

export default splitComponent({
  chunkName: 'sample-component',
  getComponent: () => import(
    /* webpackChunkName: 'sample-component' */ 'path/to/SampleComponent'
  ),
  placeholder: <div>Optional Placeholder</div>,
});
```
:::

## Original Documentation
_Valid for **dr.pogodin/react-utils** versions from **1.4.3** up to **1.13.1**_

```js
import { CodeSplit } from '@dr.pogodin/react-utils';
```

The [CodeSplit] component implements separation of an app part into
separate code & style chunks (thus, allowing to split compiled app bundle
into smaller lazy-loaded pieces).

See [the example][Examples] to understand how it should be used.

## Properties
- `chunkName` - **string** - Unique chunk name.
- `getComponentAsync` - **function** - Asynchronous function which
  resolves to the component to render in place of the [CodeSplit]
  (_i.e._ the component which we are splitting into a separate chunk),
  and uses dynamic `import()` with Webpack's
  [webpackChunkName](https://webpack.js.org/api/module-methods/#magic-comments)
  magic comment stating the same chunk name, as was specified via the
  `chunkName` property above.
- `getComponentServer` - **function** - A synchronous version of
  `getComponentAsync()` to be used during server-side rendering. If not
  provided, the server-side code will fallback to the asynchronous
  `getComponentAsync()`, which is sub-optimal.
  
  If provided, it will be called
  with a special [resolveRequire()] function passed in as the only
  argument, which should be used to correctly resolve & require necessary
  modules, without Webpack being able to detect it and thus bundle them
  into client-side code (also see the example below).
- `placeholder` - **function** - Placeholder React component to render
  while the code for actual splitted component is being loaded.
- Any other properties will be passed down into the splitted component.

### resolveRequire()
```js
function resolveRequire(base, path): object
```
A specially wrapped `require()` version. When the optional `getComponentServer`
prop (function) is provided to [CodeSplit] component, that function is called
with an instance of [resolveRequire()] passed in as the only argument. It should
be used to easily resolve the target module (and it takes care to prevent static
bundling of the module into the current code chunk).

**Arguments**
- `base` - **string** - Path resolution base. You should pass in `__dirname`
  value from the host module.
- `path` - **string** - Path to the required module.

**Returns**: **object** - Required module.

## Examples

```jsx
// Assume <SampleComponent> is a React sub-tree we want to split into
// a stand-alone chunk. To achieve it, we use <CodeSplit> to declare
// an auxiliary <WrappedSampleComponent>, which we'll use everywhere
// in the code instead of <SampleComponent>. In result <SampleComponent>,
// and any other components in its sub-tree, not required directly in
// other chunks, will be placed into a dedicated chunk.

// WrappedSampleComponent.jsx
import { CodeSplit } from '@dr.pogodin/react-utils';

export default function WrappedSampleComponent(props) {
  return (
    <CodeSplit
      chunkName="sample-component"
      getComponentAsync={
        () => import(/* webpackChunkName: 'sample-component' */ 'path/to/SampleComponent')
      }
      getComponentServer={
        // NOTE: You cannot just use the standard require() here, as it would
        // cause Webpack to bundle in required module into the current chunk,
        // instead of the split one. Thus, this workaround.
        (resolveRequire) => resolveRequire(__dirname, 'path/to/SampleComponent');
      }
      placeholder={() => <div>Optional Placeholder</div>}
      {...props}
    />
  );
}
```

<!-- Re-usable links -->
[CodeSplit]: /docs/api/components/codesplit
[Examples]: #examples
[resolveRequire()]: #resolverequire
[splitComponent()]: /docs/api/functions/splitComponent
