# Extends
[Extends]: /docs/api/types/Extends
```tsx
import type { Extends } from '@dr.pogodin/react-utils';
                  // or from '@dr.pogodin/js-utils';

type Extends<Base, T extends Base> = T;
```

The [Extends] generic validates compile-time that the type **T** extends
(is assignable to) the given **Base** type. It returns **T** for chaining
if the validation passes; otherwise it causes compilation error.

**BEWARE:** In case **Base** has some optional fields, **T** may still extends
**Base** without having them; if you want to validate that **T** has all fields
declared in **Base**, you should use [Implements] instead.

[Implements]: /docs/api/types/Implements
