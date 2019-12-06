# Code Split

```jsx
import { CodeSplit } from '@dr.pogodin/react-utils';
```

Assuming that `<SampleComponent>` is a React component, not expecting any props,
which should be compiled into a separate split code chunk (i.e. to keep JS App
bundle split into small parts, _vs_ one huge bundle, which is slow to load),
you do:

```jsx
import { CodeSplit } from '@dr.pogodin/react-utils';
import { webpack } from 'utils';

export default function ParentComponent() {
  return (
    <CodeSplit
      chunkName="sample-component-split"
      getComponentAsync={
        () => import(/* webpackChunkName: 'sample-component-split' */ 'path/to/SampleComponent')
      }
      getComponentServer={
        () => {
          const p = webpack.resolveWeak('path/to/SampleComponent');
          return webpack.requireWeak(path.resolve(__dirname, p));
        }
      }
      placeholder={() => <div>Optional Placeholder</div>}
    />
  )
}
```

### Props

- `chunkName` (_String_) &ndash; Split chunk name.
- `getComponentAsync` (_Function_) &ndash; Async function which resolves to
  the component to render.
- `placeholder` (_Function_) &ndash; Optional. Temporary placeholder to render
  while the actual chunk is being loaded.
- `getComponentServer` (_Function_) &ndash; Optional. Server-side function which
  allows to render the component syncroneously. If provided, it should rely on
  the `webpack.requireWeak(..)` function (see example above) to prevent
  the imported module to be statically bundled into the main JS file by Webpack.
