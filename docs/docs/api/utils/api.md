---
sidebar_class_name: deprecated
---
# api
[api]: /docs/api/utils/api
:::danger Deprecated
The [api] alias for [axios] library has been removed in **v1.39.0**
because it turned out incompatible with the new [mockAxios()] helper
in [Jest Utils] (it was causing a circular dependency in some tests),
and it provided little added value in general. Use [axios] directly instead.
:::

```js
import { api } from '@dr.pogodin/react-utils';
```
The [api] is just an alias for [axios]
library, which provides an isomorphic HTTP(S) client.

[axios]: https://www.npmjs.com/package/axios
[Jest Utils]: /docs/api/utils/jest-utils
[mockAxios()]: /docs/api/utils/jest-utils#mockaxios
