# Semaphore
```jsx
import { Semaphore } from '@dr.pogodin/react-utils';
```
The [Semaphore] class implements a synchronization primitive which allows
an async code to wait until the semaphore is set to the "ready" state, if
it is not in that state already. A semaphore can be switched between "ready"
and "non-ready" states as needed.

## Properties
- `semaphore.ready` &mdash; **boolean** &mdash; Read-only. Current semaphore state.

## Methods
- [constructor()] &mdash; Creates a new [Semaphore] instance.
- [seize()] &mdash; Waits until the semaphore is "ready",
  and "seizes" it for the caller.
- [setReady()] &mdash; Sets semaphore to the specified state.
- [waitReady()] &mdash; Waits until the semaphore is "ready".

### constructor()
```jsx
const semaphore = new Semaphore(ready = false);
```
Creates a new [Semaphore] instance.

**Arguments**
- `ready` &mdash; **boolean** &mdash; Optional. The initial semaphore state.
  Defaults **false**.

  :::note
  It is safe to pass in a non-boolean `ready` argument, it will be casted
  to boolean according to the usual JS rules.
  :::

### seize()
```jsx
semaphore.seize(): Promise;
```
Waits until the semaphore is "ready", and "seizes" it for the caller;
_i.e._ it switches it to the "non-ready" state, resolves returned promise,
and guarantees that no other pending [seize()] or [waitReady()] promises of this
semaphore will be resolved until the current caller sets it back to the "ready"
state. It also guarantees that all [seize()] and [waitReady()] calls will be
resolved in the same order they were triggered, _i.e._ none of them will jump
the "queue" of previous calls waiting for the semaphore.

:::note
Under the hood, a [seize()] call just waits for [waitReady(true)][waitReady()].
:::
:::caution BEWARE
Prior to the library version **v1.23.0** it was suggested that [seize()] is
equivalent to
```js
await semaphore.waitReady();
semaphore.setReady(false);
```
and in general, it held for NodeJS / browser runtimes, but relied on inner
interplay of pending [promises][Promise] and [setTimeout()] calls, and there
was no guarantee it would work in an environment with different implementation
of promises and timers.

Starting with library **v1.23.0** it is not guaranteed that in a situation when
multiple non-seizing [waitReady()] calls are waiting for a semaphore, it won't
resolve them all prior to the execution flow returning to a code waiting for
any of these promises. You must explicitly [seize()] the semaphore when you
need to guarantee mutual exclusion of different asynchronous code flows waiting
for it.
:::

### setReady()
```jsx
semaphore.setReady(ready);
```
Sets semaphore to the specified state.

**Arguments**
- `ready` &mdash; **boolean** &mdash; Target state.

  Note, it is safe to pass in a non-boolean `ready` argument, which will be
  casted to boolean according to the usual JS rules.

### waitReady()
```jsx
semaphore.waitReady(seize): Promise;
```
Creates a [Promise] which resolves as soon as the semaphore is in the "ready"
state. Optionally, it can "seize" the semaphore when called with **true**
argument.

:::caution BEWARE
Prior to the library version **v1.23.0** it was suggested that [seize()] is
equivalent to
```js
await semaphore.waitReady();
semaphore.setReady(false);
```
and in general, it held for NodeJS / browser runtimes, but relied on inner
interplay of pending [promises][Promise] and [setTimeout()] calls, but there
was no guarantee it would work in an environment with different implementation
of promises and timers.

Starting with library **v1.23.0** it is not guaranteed that in a situation when
multiple non-seizing [waitReady()] calls are waiting for a semaphore, it won't
resolve them all prior to the execution flow returning to a code waiting for
any of these promises. You must explicitly [seize()] the semaphore when you
need to guarantee mutual exclusion of different asynchronous code flows waiting
for it.
:::

**Arguments**
- `seize` &mdash; **boolean** &mdash; Optional. If set, the call will act
  the same as [seize()].

<!-- Re-usable links below -->

[Barrier]: /docs/api/classes/Barrier
[constructor()]: #constructor
[mutex]: https://en.wikipedia.org/wiki/Mutual_exclusion
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Semaphore]: /docs/api/classes/Semaphore
[seize()]: #seize
[setReady()]: #setready
[setTimeout()]: https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
[waitReady()]: #waitready
