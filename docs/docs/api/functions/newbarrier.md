---
sidebar_class_name: deprecated
---

# newBarrier()

:::danger Deprecated
The [newBarrier()] function has been deprecated in **v1.23.9**, and it will be
removed in the next minor release. Instead use [Barrier] constructor directly,
_i.e._

**Before:**
```js
import { newBarrier } from '@dr.pogodin/react-utils';

const barrier1 = newBarrier();
const barrier2 = newBarrier().then(() => console.log('OK'));
```

**Now:**
```js
import { Barrier } from '@dr.pogodin/react-utils';

const barrier1 = new Barrier();

const barrier2 = new Barrier()
  .then(() => console.log('OK'));
```
:::

# Oiginal Documentation

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
[newBarrier()]: #
