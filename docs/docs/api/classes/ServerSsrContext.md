# ServerSsrContext
[ServerSsrContext]: /docs/api/classes/ServerSsrContext
```tsx
import { ServerSsrContext } from '@dr.pogodin/react-utils';
```

The [ServerSsrContext] class extends
[SsrContext](https://dr.pogodin.studio/docs/react-global-state/docs/api/classes/ssrcontext)
class from the
[React Global State](https://dr.pogodin.studio/docs/react-global-state)
library; it is used by React Utils [server()](/docs/api/functions/server)
factory as a part of SSR setup.

## Generic Parameters
- `StateT` &mdash; The type of global state object.

## Properties
- `chunkGroups` &mdash; **ChunkGroupsT**
- `chunks` &mdash; **string[]** &mdash; Defaults empty array.
- `req` &mdash; **Request** &mdash; ExpressJS request being handled.
- `status` &mdash; **number** &mdash; HTTP status for the response.
  Defaults 200 (OK).

## Methods

### constructor()
```tsx
constructor(req: Request, chunkGroups: ChunkGroupsT, initialState?: StateT)
```
Creates a new [ServerSsrContext] instance.

**Arguments**
- `res` &mdash; **Request**
- `chunkGroups` &mdash; **ChunkGroupsT**
- `initialState` &mdash; **StateT** &mdash; Optional. Initial global state value.
