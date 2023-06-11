# splitComponent()
```jsx
import { splitComponent } from '@dr.pogodin/react-utils';

splitComponent({ chunkName, getComponent, placeholder }): React.ElementType;
```
The [splitComponent()] function wraps a specified React component for
[Code Splitting]. In other words, if a `<Component>` is only imported into
your app via [splitComponent()] function, then all `<Component>` code, and
any its sub-components, and dependency code which is not used directly in
the rest of the app, will be split into a separate code chunk, which will
be loaded to the client side only when required, thus saving the size of
the main app bundle, and hence the initial loading time for the application
as a whole.

See [the example](#example) to understand how to use it.

:::caution History
- [v1.16.0](https://github.com/birdofpreyru/react-utils/releases/tag/v1.16.0) -
  multiple [splitComponent()] signature changes:
  - `getClientSide` option was renamed into `getComponent`.
  - `serverSide` option was removed.
  - `placeholder` option was changed to accept React node instead of element
    type, _i.e._ `<Component />` instead of `Component`.
:::

## Arguments
- `options` - **object** - The only argument of [splitComponent()] is an option
  object, holding all required parameters.
  - `chunkName` - **string** - Unique name for the new code chunk, _e.g._
    `"sample-code-chunk"`.
  - `getComponent` - **function** - A function which resolves to the original
    component element, and uses dynamic `import()` with `webpackChunkName` magic
    comment matching the name provided via `chunkName` option, _e.g._ (that assumes
    the component is the default export from its module):
    ```jsx
    () => import(/* webpackChunkName: 'sample-code-chunk' */ 'path/to/SampleComponent')
    ```
    :::tip Note
    The matching `chunkName` argument and `webpackChunkName` magic comment are
    used to dynamically inject necessary CSS chunks into the page. The library
    will throw if the same chunk name is used for different split components.
    Unfortunately, it does not automatically check whether `chunkName` and
    `webpackChunkName` match, nor allows to avoid using them altogether.
    :::

  - `placeholder` - **React.ReactNode** - Optional. Placeholder element
    to render in-place of the splitted component while its code chunk is being
    loaded.

## Example

Assume **SampleComponent** is a root component for a React sub-tree which we
want to split into a stand-alone code chunk, and it was originally imported
in our code like this:
```jsx
import SampleComponent from 'path/to/SampleComponent';
```

To split it into a separate code chunk:

1) Use [splitComponent()] function to wrap **SampleComponent** for the code
  splitting. For that, in the code which will be using **SampleComponent**
  (outside the new chunk), you create a wrapper component (it also can be done directly
  in the file where you need it, if you need it in a single file only):
  ```jsx
  // path/to/SplittedSampleComponent.js

  import { splitComponent, webpack } from '@dr.pogodin/react-utils';

  export default splitComponent({
    chunkName: 'sample-component-chunk',
    getComponent: () => import(
      /* webpackChunkName: 'sample-component-chunk' */ 'path/to/SampleComponent'
    ),
    placeholder: <div>Optional Placeholder</div>,
  });
  ```
2) Everywhere **SampleComponent** is used (outside its new chunk), you replace
  the original imports by imports of the wrapped component created above:
  ```jsx
  import SampleComponent from 'path/to/SplittedSampleComponent';
  ```
  That's it, **SampleComponent** from `path/to/SplittedSampleComponent` will
  work exactly the same as the original component, but it will live in a separate
  code chunk, assuming you have removed all regular imports / required of that
  component from outside its chunk.

<!-- Reusable links -->
[Code Splitting]: https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting
[splitComponent()]: /docs/api/functions/splitComponent
[webpack.requireWeak()]: /docs/api/utils/webpack#requireweak
