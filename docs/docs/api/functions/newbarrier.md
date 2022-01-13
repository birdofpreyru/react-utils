# newBarrier()
```jsx
import { newBarrier } from '@dr.pogodin/react-utils';

newBarrier(): Barrier
```
Creates a new [Barrier] instances. It is just a syntax sugare which makes this
more readable:
```jsx
const barrier = newBarrier().then(() => console.log('OK'));
```

[Barrier]: /docs/api/classes/Barrier
