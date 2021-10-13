# newBarrier()
```jsx
import { newBarrier } from '@dr.pogodin/react-utils';

newBarrier(): Promise
```

Creates a new asynchronous barrier: a **Promise** instance which has its
`resolve()` method attached as `resolve` field.

**Example**
```jsx
import { newBarrier, time } from '@dr.pogodin/react-utils';

(async () => {
  const barrier = newBarrier();
  time.timer(5000).then(() => barrier.resolve());
  await barrier;
  console.log('Done');
})();
```

