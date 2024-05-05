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
  `react` (moved into `react` package since React v18.3).
- [getMockUuid()](#getmockuuid) - Generates a mock UUID (formats the given `seed`
  into an UUID-formatted string).
- [mockClientSide()] - Tricks **react-utils** into thinking the test is running
  within the client-side (browser) environment.
- [mockTimer()](#mocktimer) - Advances mock timers, and mock date by
  the specified time step.
- [mount()](#mount) - Mounts `scene` to the DOM, and returns the root scene
  element with **.destroy()** method attached.
- [snapshot()](#snapshot) - Does does a snapshot test of the give ReactJS
  component, and also returns JSON representation of is render.
- [unmockClientSide()](#unmockclientside) - Reverts the effect of previous
  [mockClientSide()] call.

:::caution Deprecated Methods
- [render()](#render) &mdash; Removed in **v1.34.0**. Migrate to
  [render()] provided by [@testing-library/react].
- [shallowRender()] &mdash; Removed in **v1.34.0**. Starting with React v19
  it is recommended to [avoid shallow rendering] in tests.
- [shallowSnapshot()](#shallowsnapshot) &mdash; Removed in **v1.34.0**.
  Starting with React v19 it is recommended to [avoid shallow rendering]
  in tests.
- [simulate](#simulate) &mdash; Removed in **v1.34.0**. Use instead
  [@testing-library/user-event], or the lower-level [fireEvent] from
  [@testing-library/dom].
:::

### act()
```jsx
JU.act(action)
```
This method is just an alias for
[act()](https://reactjs.org/docs/test-utils.html#act) function from
`react` ((moved into `react` since v18.3)).

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
:::danger Deprecated
Removed in **v1.34.0**. Migrate to [render()] provided by [@testing-library/react].
:::

### shallowRender()
:::danger Deprecated
Removed in **v1.34.0**. Starting with React v19 it is recommended to
[avoid shallow rendering] in tests.
:::

### shallowSnapshot()
:::danger Deprecated
Removed in **v1.34.0**. Starting with React v19 it is recommended to
[avoid shallow rendering] in tests.
:::

### simulate()
:::danger Deprecated
Removed in **v1.34.0**. Use instead [@testing-library/user-event],
or the lower-level [fireEvent] from [@testing-library/dom].
:::

### snapshot()
```jsx
JU.snapshot(element) => object
```
It does a snapshot test of the given ReactJS component.

<details>
<summary>Example</summary>

```tsx
/** @jest-environment jsdom */

import { JU } from '@dr.pogodin/react-utils/jest-utils';

test('A snapshot test', () => {
  JU.snapshot(<div>Example</div>);
});
```
</details>

:::caution Beware
- It relies on [render()] function provided by [@testing-library/react],
  thus it renders provided component into DOM (**appends it to the current DOM
  content**), and snapshots HTML representation of the generated DOM node.

- It requires JSDom test environment, thus a Jest test relying on this method
  should start with the magic comment `/** @jest-environment jsdom */`, or it
  should provide a virtual DOM in an alternative way.

- Prior to **v1.34.0** this method relied on now deprecated
  [react-test-renderer](https://www.npmjs.com/package/react-test-renderer),
  and thus it was snapshotting and returning a JSON representation of the rendered
  component tree, without requiring or modifying the virtual DOM.
:::

**Arguments**
- `component` &mdash; **React.ReactElement** &mdash; React element to snapshot.

**Returns**
- [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) &mdash;
  rendered DOM node.

### unmockClientSide()
```jsx
JU.unmockClientSide()
```
Reverts the effect of previous [mockClientSide()] call.

[@testing-library/dom]: https://testing-library.com/docs/dom-testing-library/intro
[@testing-library/react]: https://testing-library.com/docs/react-testing-library/intro/
[@testing-library/user-event]: https://testing-library.com/docs/user-event/intro
[avoid shallow rendering]: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-react-test-renderer-shallow
[E2eSsrEnv]: /docs/api/classes/E2eSsrEnv
[fireEvent]: https://testing-library.com/docs/dom-testing-library/api-events
[Jest]: https://jestjs.io
[JU]: /docs/api/utils/jest-utils
[mockClientSide()]: #mockclientside
[render()]: https://testing-library.com/docs/react-testing-library/api#render
[shallowRender()]: #shallowrender
