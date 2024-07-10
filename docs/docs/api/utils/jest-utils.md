# Jest Utils
Collection of helpers useful in [Jest] tests.

:::caution
Prior to **v1.35.0** these utilities were exported as `JU` module of the main
package export, now they are exposed via a dedicated secondary export.

<details>
For example, to use [snapshot()] helper in a test prior to **v1.35.0** you would
do (and `JU` would be `null` when imported in non-`development` build, or outside
the server-side environment):
```tsx
import { JU } from '@dr.pogodin/react-utils';

test('Example', () => {
  JU!.snapshot(<div>Hello World</div>);
});
```
Starting with **v1.35.0** you must do:
```tsx
/** @jest-environment jsdom */

import { snapshot } from '@dr.pogodin/react-utils/jest';

test('Example', () => {
  snapshot(<div>Hello World</div>);
});
```
The change was done to avoid module resolution issues when using JSDom
environment for Jest tests.
</details>
:::

## E2eSsrEnv
Although it is not exported from this module for technical reasons, [E2eSsrEnv]
class implements Jest environment for end-to-end testing of SSR and client-side
execution of Webpack-built code with Jest, and thus should be considered as
a very important part of Jest-testing utilities provided by the library.

## Methods
- [act()](#act) &mdash; An alias for
  the [act()](https://reactjs.org/docs/test-utils.html#act) function from
  `react` (moved into `react` package since React v18.3).
- [getMockUuid()](#getmockuuid) - Generates a mock UUID (formats the given `seed`
  into an UUID-formatted string).
- [mockAxios()] &mdash; A helper which simplifies mocking out of [axios]
  (our selected HTTP(S) client library) in tests.
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
```tsx
import { act } from '@dr.pogodin/react-utils/jest';
```
This method is just an alias for
[act()](https://reactjs.org/docs/test-utils.html#act) function from
`react` (moved into `react` since v18.3).

### getMockUuid()
```tsx
import { getMockUuid } from '@dr.pogodin/react-utils/jest';

function getMockUuid(seed = 0): string;
```
Generates a mock UUID by determenistically transforming the given `seed` into
a UUID-formatted string.

**Arguments**
- `seed` &mdash; **number** &mdash; Optional. Defaults `0`.

**Returns**
- **string** - Mock UUID.

### mockAxios()
[mockAxios()]: #mockaxios
```ts
import { mockAxios } from '@dr.pogodin/react-utils/jest';

function mockAxios(handlers: AxiosRequestHandler[]): Axios;
```

[mockAxios()] is a helper which simplifies mocking out of [axios] (our selected
HTTP(S) client library) in tests. To use it, you want to create `__mock__/axios.ts`,
or `__mock__/axios/index.ts` file in the root of the host codebase:
```tsx
// Basic __mock__/axios.ts example.

import { type AxiosRequestHandlerT, mockAxios } from '@dr.pogodin/react-utils/jest';

const sampleHandler: AxiosRequestHandlerT = (config) {
  if (config.url === 'https://dr.pogodin.studio/docs/react-utils') {
    return { data: 'mock reponse' };
  }
};

export default mockAxios([
  sampleHandler,
]);
```

With such setup, every call to [axios] within Jest tests will be run through
each of provided mock request handlers; if any handler returns an object,
the corresponding [axios] call will be returned to that result (with any
omitted fields of [axios] response set to reasonable default values). If all
handlers return **null** or **undefined** results, the mock will fallback
to the real network call, and it will print a warning to the console, with
details of the corresponding request and response (which will help you to
mock that out).

For further details refer to [axios] documentation for
[request config](https://www.npmjs.com/package/axios#request-config)
(the argument of mock request handlers),
and [response schema](https://www.npmjs.com/package/axios#response-schema)
(the result of mock request handlers should be a
[partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)
of it).

### mockClientSide()
```tsx
import { mockClientSide } from '@dr.pogodin/react-utils/jest';

function mockClientSide();
```
Tricks **react-utils** library into thinking the test is running within
the client-side (browser) environment.

### mockTimer()
```tsx
import { mockTimer } from '@dr.pogodin/react-utils/jest';

async function mockTimer(time: number): Promise<void>;
```
Advances mock timers, and mock date by the specified time step.

**Arguments**

- `time` - **number** - The time step [ms].

**Returns**

- **Promise** - Resolves once all async operations triggered by the mock
  time advance have completed.

### mount()
```tsx
import { mount } from '@dr.pogodin/react-utils/jest';

function mount(scene: ReactNode): MountedSceneT;
```
Mounts given `scene` into DOM and returns the root scene element (DOM node) with
**.destroy()** and **.snapshot()** methods attached. The former of these methods
unmounts the scene from DOM; and the later snapshots the scene (_i.e._ is is
an alias for `expect(scene).toMatchSnapshot()`).

**Arguments**
- `scene` - **React.ReactNode** - The scene.

**Returns**
- **HTMLElement** - The root DOM element of the mounted scene with
  **.destroy()** and **.snapshot()** methods attached.

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
[snapshot()]: #snapshot
```tsx
import { mount } from '@dr.pogodin/react-utils/jest';

function snapshot(
  element: React.ReactElement,
  options?: SnapshotOptionsT,
): Node | null;
```
It does a snapshot test of the given ReactJS component.

<details>
<summary>Example</summary>

```tsx
/** @jest-environment jsdom */

import { snapshot } from '@dr.pogodin/react-utils/jest';

test('A snapshot test', () => {
  snapshot(<div>Example</div>);
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
- `options` &mdash; [SnapshotOptionsT] | **undefined** &mdash; Optional settings.

**Returns**
- [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) &mdash;
  rendered DOM node.

#### SnapshotOptionsT
[SnapshotOptionsT]: #snapshotoptionst
```ts
type SnapshotOptionsT = {
  await?: Promise<void>;
};
```
Optional settings for [snapshot()] method.
- `await` &mdash; **Promise&lt;void&gt;** | **undefined** &mdash; Optional.
  If provided, [snapshot()] will await for this promise prior to capturing
  the result of component render (it is awaited after the render is triggered).

### unmockClientSide()
```tsx
import { unmockClientSide } from '@dr.pogodin/react-utils/jest';

function unmockClientSide();
```
Reverts the effect of previous [mockClientSide()] call.

[@testing-library/dom]: https://testing-library.com/docs/dom-testing-library/intro
[@testing-library/react]: https://testing-library.com/docs/react-testing-library/intro/
[@testing-library/user-event]: https://testing-library.com/docs/user-event/intro
[avoid shallow rendering]: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-react-test-renderer-shallow
[axios]: https://www.npmjs.com/package/axios
[E2eSsrEnv]: /docs/api/classes/E2eSsrEnv
[fireEvent]: https://testing-library.com/docs/dom-testing-library/api-events
[Jest]: https://jestjs.io
[JU]: /docs/api/utils/jest-utils
[mockClientSide()]: #mockclientside
[render()]: https://testing-library.com/docs/react-testing-library/api#render
[shallowRender()]: #shallowrender
