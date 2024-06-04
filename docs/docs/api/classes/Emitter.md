# Emitter
[Emitter]: /docs/api/classes/Emitter
```tsx
import { Emitter } from '@dr.pogodin/react-utils'; // or from '@dr.pogodin/js-utils'
```
The [Emitter] class implements a simple, listeneable data emitter.

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

## Fields
- `.hasListeners` &mdash; **boolean** &mdash; **true** if any listener is connected
  to the emitter; **false** otherwise.
- `.listeners` &mdash; **Array&lt;[Listener]&gt;** &mdash; Array of listeners connected to the emitter.
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
const emitter = new Emitter<T extends unknown[] = unknown[]>();
```
Creates a new emitter with no listeners connected.

**TypeScript:** The optional generic parameter `T` specifies the exact set of
arguments expected by [emit()] method of created emitter, and thus the signature
and arguments received by connected [listeners][Listener]. It defaults to
`unknown[]` &mdash; unknown set of arguments.

### addListener()
```jsx
emitter.addListener(listener: Listener): function;
```
Connects given [listener][Listener] to the emitter, or does nothing if it is already
connected. Each connected listener will be called once on each subsequent
[emit()] call with the arguments passed into [emit()].

This method returns a function which can be triggered with no arguments to
unsubscribe `listener` from the emitter. It is just an auxiliary wrapper around
[removeListener()] method, which can be used alternatively.

### emit()
[emit()]: #emit
```jsx
emitter.emit(...args: T);
```
Calls every connected listener once with the given arguments.

**TypeScript:** The argument types are specified by the generic parameter given
to the [constructor()], which defaults to `unknown[]`.

### removeAllListeners()
```jsx
emitter.removeAllListeners()
```
Diconnects all listeners from the emitter.

### removeListener()
```jsx
emitter.removeListener(listener: Listener);
```
Disconnects given [listener][Listener] from the emitter, or does nothing if it is not
connected to it.

## Related Types

### Listener
[Listener]: #listener
```tsx
import type {Listener} from '@dr.pogodin/react-utils'; // or from '@dr.pogodin/js-utils'

type Listener<T extends unknown[] = unknown[]> = (...args: T) => void;
```
The [Listener] type specifies the valid signature of listener functions that
can be attached to an instance of [Emitter] class. It accepts one optional
generic parameter, that specifies valid arguments accepted by the listener.
That parameter defaults to `unknown[]` 

[JS Utils]: https://www.npmjs.com/package/@dr.pogodin/js-utils

[addListener()]: #addlistener
[constructor()]: #constructor
[removeAllListeners()]: #removealllisteners
[removeListener()]: #removelistener
