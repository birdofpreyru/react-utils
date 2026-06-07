import Beware from '../common/_beware-depends-on-app-setup.md';

# assertClientSide()
```tsx
import { assertClientSide } from '@dr.pogodin/react-utils';

function assertClientSide(): void;
```
Throws an error if executed not on the client-side
(if [IS_CLIENT_SIDE] equals **false**).

<Beware />

[IS_CLIENT_SIDE]: /docs/api/constants/is_client_side
