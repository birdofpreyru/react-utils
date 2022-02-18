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
- [seize()] - Allows to wait until the semaphore is in the "ready" state, and
  automatically switches it to the "non-ready" state for the caller.
- [setReady()] - Sets semaphore to the specified state.
- [waitReady()] - Allows to wait until the semaphore is in the "ready" state.

### constructor()
```jsx
const semaphore = new Semaphore(ready = false);
```
Creates a new [Semaphore] instance.

**Arguments**
- `ready` - **boolean** - Optional. The initial semaphore state.
  Defaults **false**.

  Note, it is safe to pass in a non-boolean `ready` argument, which will be
  casted to boolean according to the usual JS rules.

### seize()
```jsx
semaphore.seize(): Promise;
```
Waits until the semaphore is ready, then immediately sets it non-ready again
(seizes it for the caller), and resolves returned [Promise].

`await semaphore.seize()` call is equivalent to:
```jsx
await semaphore.waitReady();
semaphore.setReady(false);
```

### setReady()
```jsx
semaphore.setReady(ready);
```
Sets semaphore to the specified state.

**Arguments**
- `ready` - **boolean** - Target state.

  Note, it is safe to pass in a non-boolean `ready` argument, which will be
  casted to boolean according to the usual JS rules.

### waitReady()
```jsx
semaphore.waitReady(): Promise;
```
Creates a [Promise] which resolves as soon as the semaphore is in the "ready"
state.

Unlike [Barrier] instances, a semaphore does not resolve all pending
[waitReady()] promises immediately when switched to the "ready" state.
It rather resolves them _synchronously_ one by one, giving each async
code flow waiting for it a chance to re-lock the semaphore before next
pending promise is resolved. Thus, a semaphore can be used as [mutex],
if each asynchronous code waiting for a semaphore sets it back to "non-ready"
state as soon as it resolved.

:::tip
Note that [seize()] function is essentially a short for doing
```js
await semaphore.waitReady();
semaphore.setReady(false);
```
:::

It is guaranteed that a later call to `semaphore.waitReady()` is resolved
later than an earlier call.

## Properties
- `semaphore.ready` - **boolean** - Read-only. Current semaphore state.

<!-- Re-usable links below -->

[Barrier]: /docs/api/classes/Barrier
[constructor()]: #constructor
[mutex]: https://en.wikipedia.org/wiki/Mutual_exclusion
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Semaphore]: /docs/api/classes/Semaphore
[seize()]: #seize
[setReady()]: #setready
[waitReady()]: #waitready
