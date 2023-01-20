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

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[seize()]: #seize
[setTimeout()]: https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
[waitReady()]: #waitready
