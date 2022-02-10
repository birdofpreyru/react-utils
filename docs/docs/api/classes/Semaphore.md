# Semaphore
```jsx
import { Semaphore } from '@dr.pogodin/react-utils';
```
The [Semaphore] class implements a synchronization primitive which allows
an async code to wait until the semaphore is set to the "ready" state, if
it is not in that state already. A semaphore can be switched between "ready"
and "non-ready" states as needed.

## Methods
- [constructor()] - Creates a new [Semaphore] instance.
- [setReady()] - Sets semaphore to the specified state.
- [waitReady()] - Creates a [Promise] which resolves as soon as the semaphore
  is in "ready" state.

### constructor()
```jsx
const semaphore = new Semaphore(ready = false);
```
Creates a new [Semaphore] instance.

**Arguments**
- `ready` - **boolean** - Optional. The initial semaphore state. Defaults **false**.

### setReady()
```jsx
semaphore.setReady(ready);
```
Sets semaphore to the specified state.

**Arguments**
- `ready` - **boolean** - Target state.

### waitReady()
```jsx
semaphore.waitReady(): Promise;
```
Creates a [Promise] which resolves as soon as the semaphore is in the "ready"
state.

Note that unlike [Barrier] instances, a semaphore does not resolve all
pending [waitReady()] promises immediately when switched to "ready" state.
Setting a semaphore to "ready" will trigger an attempt to _synchronously_
resolve each pending [waitReady()] promise for that semaphore, for each of
these promises the actual state of the semaphore at the moment of resolution
attempt will be tested, and if it has switched back to "non-ready", the promise
will remain pending until the next resolution chance. Thus, a semaphore can
be used as [mutex], if each asynchronous code waiting for a semaphore sets it
back to "non-ready" state as soon as it resolved.

## Properties
- `semaphore.ready` - **boolean** - Read-only. Current semaphore state.

<!-- Re-usable links below -->

[Barrier]: /docs/api/classes/Barrier
[constructor()]: #constructor
[mutex]: https://en.wikipedia.org/wiki/Mutual_exclusion
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Semaphore]: /docs/api/classes/Semaphore
[setReady()]: #setready
[waitReady()]: #waitready
