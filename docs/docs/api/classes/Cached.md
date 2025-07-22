# Cached
[Cached]: /docs/api/classes/Cached
```ts
import { Cached } from '@dr.pogodin/react-utils'; // or from '@dr.pogodin/js-utils'
```
The [Cached] class implements a cache of asynchrounously, or synchronously
retrieved items, with timestamp-based expiration.

<details>
<summary>Example</summary>

```tsx
import { Cached, time } from '@dr.pogodin/react-utils'; // or from '@dr.pogodin/js-utils'

type SampleItemT = { key: string };

/** Asynchronously retrieves some data, indexed by a string key. */
async function getter(key: string): Promise<SampleItemT> {
  await time.timer(3 * time.SEC_MS);
  return { key: `value-for-${key}` };
}

/** Cache of items retrived by getter(), with 5 minutes expiration. */
const cached = new Cached(5 * time.MIN_MS, getter);

async function example() {
  // This operation will trigger getter('X'), and thus will take 3 seconds.
  console.log(await cached.get('X'));

  // This operation will server the cached value from the previous operation,
  // thus it will take no time (technically, .get('X') will return the value
  // right away, not a promise of the value).
  console.log(await cached.get('X'));

  // Here we wait for 5 minutes - the cache expiration time, thus the next call
  // to .get('X') will trigger, and wait for getter('X') again, refreshing
  // the cached value. NOTE: Behind the scene .get() calls also remove from
  // the cache any stale entries.
  await time.timer(5 * time.MIN_MS);
  console.log(await cached.get('X'));
}
```
</details>

## Generic Parameters
- `T` &mdash; [Cached] class is defined as a TypeScript generic `class Cached<T>`,
  with its only generic parameter `T` specifying the type of cached items.

## Fields
- `.data` &mdash; **Readonly&lt;Record&lt;string, EntryT&lt;T&gt;&gt;&gt;**
  &mdash; Readonly view of the cache content, exposed for test purposes.
  See [the source code](https://github.com/birdofpreyru/js-utils/blob/master/src/Cached.ts)
  for the exact definition of **EntryT** &mdash; it is either an envelope of
  a cached item, or a timestamped promise of such envelope.

- `.oldestTimestamp` &mdash; **number** &mdash; Timestamp of the oldest item
  stored in the cache. Exposed for test purposes.

## Methods
- [constructor()] &mdash; Creates a new [Cached] instance.
- [get()] &mdash; Retrieves item for the given key.

### constructor()
[constructor()]: #constructor
```tsx
const cached = new Cached<T>(
  maxage: number,
  getter: (id: string) => T | Promise<T>,
);
```
- TypeScript generic parameter `T` specifies the type of cached items.
- `maxage` &mdash; **number** &mdash; Expiration time of items in the cache
  (milliseconds).
- `getter` &mdash; **(id: string) => T | Promise&lt;T&gt;** &mdash;
  A getter function that returns the item (or a promise of the item)
  for the given string key (id).

### get()
[get()]: #get
```tsx
cached.get(id: string, forceRefresh?: boolean): T | Promise<T>;
```
Retrieves the item (or a promise of the item) for the given string key (id).

If the item for the given key is present in the cache, and it is not stale
(its timestamp is within the `maxage` limit, specified at the cache construction
time), it is returned right away.

Otherwise, if the item for this key have been requested already within the last
`maxage` interval, and the getter returned a promise, which is still pending to
be resolved, or has rejected, this [get()] call will return the same promise.
_I.e._ if [get()] is called multiple times for the same key, faster than
the asynchronous getter is able to retrieve the item, only the first [get()]
call will trigger the getter for this key, and subsequent [get()] calls will
just return the promise of the same getter operation. If the getter promise
rejects, or does not resolve within the `maxage` limit, the cache will keep
returning that promise for this key for the `maxage` since the getter call
has been triggered; and once `maxage` time has passed, the next [get()] call
for that key will re-try to get the item, with a new getter call.

Otherwise, this method triggers the getter, provided to [constructor()]
to retrieve and cache the item, and it returns the result of the operation.

[get()] method also takes care to clean the cache of stale entries,
and promises, as needed.

- `id` &mdash; **string** &mdash; Key (id) of the item to retrieve.
- `forceRefresh` &mdash; **boolean** | **undefined** &mdash; Optional.
  If _true_ the requested item is explicitly retreived with the getter
  (and cached), no matter whether it was present in the cache already.

- Returns **T** | **Promise&lt;T&gt;** &mdash; the requested item,
  or a promise of that item.
