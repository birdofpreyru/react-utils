# newBarrier()

```jsx
import { newBarrier } from '@dr.pogodin/react-utils';
```

The `newBarrier()` method just creates a Promise which has its resolve method
attached to the instance as `.resolve` field. A redundant example of its usage:

```jsx
(async () => {
  const barrier = newBarrier();

  setTimeout(() => barrier.resolve(), 5000);

  await barrier;

  console.log('This will be printed only after the timeout fires.');
})();
```

In most cases you don't need such barriers, as a cleaner code can be written
with normal promises. However, in some cases it turns out useful.
