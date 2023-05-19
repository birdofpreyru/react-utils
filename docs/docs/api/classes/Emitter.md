# Emitter
```jsx
import { Emitter } from '@dr.pogodin/react-utils';
```
[Emitter] class implements a simple listeneable data emitter.

<details>
<summary>Example</summary>

```jsx
const emitter = new Emitter();
const unsubscribe = emitter.addListener(console.log);
emitter.emit('Hello World!'); // Console output: Hello World!
unsubscribe(); // Disconnects the listener from the emitter.
emitter.emit('Are you listening?'); // Console outputs nothing.
```
</details>

:::info
The [Emitter] source code has been moved to [JS Utils] library, and it is
re-exported from there; thus, it also can be imported as
```js
import { Emitter } from '@dr.pogodin/js-utils';
```
:::

## Fields
- `.hasListeners` &mdash; **boolean** &mdash; **true** if any listener is connected
  to the emitter; **false** otherwise.
- `.listeners` &mdash; **function[]** &mdash; Array of listeners connected to the emitter.
  Although accessible for direct manipulations, [addListener()] and
  [removeListener()] methods should be preferred to add/remove listeners
  in most cases.

## Methods
- [constructor()] &mdash; Creates a new emitter with no listeners connected.
- [addListener()] &mdash; Connects given listener to the emitter.
- [emit()] &mdash; Calls every connected listener with given arguments.
- [removeAllListeners()] &mdash; Disconnects all listeners from the emitter.
- [removeListener()] &mdash; Disconnects given listener from the emitter.

### constructor()
```jsx
const emitter = new Emitter();
```
Creates a new emitter with no listeners connected.

### addListener()
```jsx
emitter.addListener(listener: function): function;
```
Connects given `listener` to the emitter, or does nothing if it is already
connected. Each connected listener will be called once on each subsequent
[emit()] call with the arguments passed into [emit()].

This method returns a function which can be triggered with no arguments to
unsubscribe `listener` from the emitter. It is just an auxiliary wrapper around
[removeListener()] method, which can be used alternatively.

### emit()
```jsx
emitter.emit(...args: any);
```
Calls every connected listener once with the given arguments.

### removeAllListeners()
```jsx
emitter.removeAllListeners()
```
Diconnects all listeners from the emitter.

### removeListener()
```jsx
emitter.removeListener(listener: function);
```
Disconnects given `listener` from the emitter, or does nothing if it is not
connected to it.

[JS Utils]: https://www.npmjs.com/package/@dr.pogodin/js-utils
[Emitter]: /docs/api/classes/Emitter
[addListener()]: #addlistener
[constructor()]: #constructor
[emit()]: #emit
[removeAllListeners()]: #removealllisteners
[removeListener()]: #removelistener
