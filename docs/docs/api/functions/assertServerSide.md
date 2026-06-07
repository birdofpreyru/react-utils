import Beware from '../common/_beware-depends-on-app-setup.md';

# assertServerSide()
```tsx
import { assertServerSide } from '@dr.pogodin/react-utils';

function assertServerSide(): void;
```
Throws an error if executed not on the client-side
(if [IS_SERVER_SIDE] equals **false**).

<Beware />

[IS_SERVER_SIDE]: /docs/api/constants/is_server_side
