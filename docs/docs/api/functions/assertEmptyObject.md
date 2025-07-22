# assertEmptyObject()
```tsx
import { assertEmptyObject, type ObjectKey } from '@dr.pogodin/react-utils';
                                       // or from '@dr.pogodin/js-utils';

function assertEmptyObject(object: Record<ObjectKey, never>): void;
```

Asserts the given object is empty, both at compile- and runtime. At compile-time
the assertion is achieved via the argument's type definition, as the TypeScript
compiler will forbid to pass in any argument that is not an empty object.
At runtime this function throws an error if the given object has any key
(as per `Object.keys()`).

## Arguments

- `object` &mdash; **Record&lt;ObjectKey, never&gt;** &mdash;
  The object to assert.
