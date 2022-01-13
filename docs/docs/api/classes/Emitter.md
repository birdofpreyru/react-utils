# Emitter
```jsx
import { Emitter } from '@dr.pogodin/react-utils';
```
[Emitter] class implements a simple listeneable data emitter.

**Example**
```jsx
const emitter = new Emitter();
const unsubscribe = emitter.addListener(console.log);
emitter.emit('Hello World!'); // Console output: Hello World!
unsubscribe(); // Disconnects the listener from the emitter.
emitter.emit('Are you listening?'); // Console outputs nothing.
```

## Fields
- `.hasListeners` - **boolean** - **true** if any listener is connected
  to the emitter; **false** otherwise.
- `.listeners` - **function[]** - Array of listeners connected to the emitter.
  Although accessible for direct manipulations, [addListener()] and
  [removeListener()] methods should be preferred to add/remove listeners
  in most cases.

## Methods
- [constructor()] - Creates a new emitter with no listeners connected.
- [addListener()] - Connects given listener to the emitter.
- [emit()] - Calls every connected listener with given arguments.
- [removeListener()] - Disconnects given listener from the emitter.

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

### removeListener()
```jsx
emitter.removeListener(listener: function);
```
Disconnects given `listener` from the emitter, or does nothing if it is not
connected to it.

[Emitter]: /docs/api/classes/Emitter
[addListener()]: #addlistener
[constructor()]: #constructor
[emit()]: #emit
[removeListener()]: #removelistener
