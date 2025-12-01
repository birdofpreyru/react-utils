# Implements
[Implements]: /docs/api/types/Implements
```tsx
import type { Implements } from '@dr.pogodin/react-utils';
                     // or from '@dr.pogodin/js-utils';

type Implements<
  Base,
  T extends Required<T> extends Required<Base> ? Base : Required<Base>,
> = T;
```

The [Implements] generic validates compile-time that the type **T** has all
fields the given **Base** type has. It returns **T** for chaining if the validation
passes; otherwise it causes compilation error.

See also: [Extends]

[Extends]: /docs/api/types/Extends
