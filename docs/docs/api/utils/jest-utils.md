# JU (Jest Utils)
```jsx
import { JU } from '@dr.pogodin/react-utils';
```
The [JU] module (short for **[Jest] utilities**) provides helpers useful in
[Jest] tests.

:::caution Beware
The [JU] module is exported and functional only within the development, [Jest]
environment.
:::

## E2eSsrEnv
Although it is not exported from this module for technical reasons, [E2eSsrEnv]
class implements Jest environment for end-to-end testing of SSR and client-side
execution of Webpack-built code with Jest, and thus should be considered as
a very important part of Jest-testing utilities provided by the library.

## Methods
- [act()](#act) - An alias for
  the [act()](https://reactjs.org/docs/test-utils.html#act) function from
  **react-dom/test-utils**.
- [getMockUuid()](#getmockuuid) - Generates a mock UUID (formats the given `seed`
  into an UUID-formatted string).
- [mockClientSide()] - Tricks **react-utils** into thinking the test is running
  within the client-side (browser) environment.
- [mockTimer()](#mocktimer) - Advances mock timers, and mock date by
  the specified time step.
- [mount()](#mount) - Mounts `scene` to the DOM, and returns the root scene
  element with **.destroy()** method attached.
- [render()](#render) - Renders ReactJS component into JSON representation of
  the component tree.
- [shallowRender()] - Generates a shallow render of ReactJS component.
- [shallowSnapshot()](#shallowsnapshot) - It does a shallow snapshot test of
  the given ReactJS component.
- [simulate](#simulate) - An alias for
  [Simulate](https://reactjs.org/docs/test-utils.html#simulate)
  from `react-dom/test-utils`.
- [snapshot()](#snapshot) - Does does a snapshot test of the give ReactJS
  component, and also returns JSON representation of is render.
- [unmockClientSide()](#unmockclientside) - Reverts the effect of previous
  [mockClientSide()] call.

### act()
```jsx
JU.act(action)
```
This method is just an alias for
[act()](https://reactjs.org/docs/test-utils.html#act) function from
`react-dom/test-utils`.

### getMockUuid()
```jsx
JU.getMockUuid(seed) => string
```
Generates a mock UUID by determenistically transforming the given `seed` into
a UUID-formatted string.

**Arguments**
- `seed` - **number** - Defaults `0`.

**Returns**
- **string** - Mock UUID.

### mockClientSide()
```jsx
JU.mockClientSide()
```
Tricks **react-utils** library into thinking the test is running within
the client-side (browser) environment.

### mockTimer()
```jsx
JU.mockTimer(time) => Promise<>
```
Advances mock timers, and mock date by the specified time step.

**Arguments**

- `time` - **number** - The time step [ms].

**Returns**

- **Promise** - Resolves once all async operations triggered by the mock
  time advance have completed.

### mount()
```jsx
JU.mount(scene) => HTMLElement
```
Mounts `scene` to the DOM and returns the root scene element (DOM node) with
**.destroy()** method attached, which unmounts the scene from DOM.

**Arguments**
- `scene` - **React.ReactNode** - The scene.

**Returns**
- **HTMLElement** - The root DOM element of the mounted scene with
  **.destroy()** method attached.

### render()
```jsx
JU.render(component) => object
```
Renders provided ReactJS component into JSON representation of the component
tree, using [`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer).

**Arguments**
- `component` - **React.Node** - ReactJS component to render.

**Returns**
- **object** - JSON representation of the rendered tree.

**Example**
```jsx
import { JU } from '@dr.pogodin/react-utils';

const tree = JU.render(<div>Example</div>);
```

### shallowRender()
```jsx
JU.shallowRender(component) => object
```
Generates a shallow render of given ReactJS component, using
[react-test-renderer/shallow](https://reactjs.org/docs/shallow-renderer.html)
and returns the result.

**Arguments**
- `component` - **React.Node** - ReactJS component to render.

**Returns**
- **object** - JSON representation of the rendered shallow component tree.

**Example**
```jsx
import { JU } from '@dr.pogodin/react-utils/jest-utils';

const tree = JU.shallowRender(<div>Example</div>);
```

### shallowSnapshot()
```jsx
JU.shallowSnapshot(component) => object
```
Does a shallow snapshot test of the given ReactJS component, and also returns
JSON representation of the rendered shallow component tree. Under the hood it
uses [shallowRender()] to generate the render, then executes
`expect(RENDERED_TREE).toMatchSnapshot()`, then returns `RENDERED_TREE`
as the method result.

**Arguments**
- `component` - **React.Node** - ReactJS component to render.

**Returns**
- **object** - JSON representation of the shallow render.

**Example**
```jsx
import { JU } from '@dr.pogodin/react-utils/jest-utils';

test('A snapshot test', () => {
  JU.shallowSnapshot(<div>Example</div>);
});
```
### simulate()
```jsx
JU.simulate
```
This is an alias for
[Simulate](https://reactjs.org/docs/test-utils.html#simulate) object from
`react-dom/test-utils`, which helps to emulate DOM events.

### snapshot()
```jsx
JU.snapshot(component) => object
```
It does a snapshot test of the given ReactJS component, and also returns JSON
representation of the rendered component tree. Under the hood it uses
[render()](#render) to render the component, then executes
`expect(RENDERED_TREE).toMatchSnapshot()`, then retuns `RENDERED_TREE`
as the method output.

**Arguments**
- `component` - **React.Node** - ReactJS component to test.

**Returns**
- **object** - JSON render of the componet.

**Examples**
```jsx
import { JU } from '@dr.pogodin/react-utils/jest-utils';

test('A snapshot test', () => {
  JU.snapshot(<div>Example</div>);
});
```

### unmockClientSide()
```jsx
JU.unmockClientSide()
```
Reverts the effect of previous [mockClientSide()] call.

[E2eSsrEnv]: /docs/api/classes/E2eSsrEnv
[Jest]: https://jestjs.io
[JU]: /docs/api/utils/jest-utils
[mockClientSide()]: #mockclientside
[shallowRender()]: #shallowrender
