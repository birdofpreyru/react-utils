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

- `redirectTo` &mdash; **string** | **undefined** &mdash; Undefined by default;
  if it is set by the app during SSR, the server will trigger redirect to this
  URL, instead of serving the generated HTML markup. Note, it will use `status`
  property (below) to set the redirect code, thus it also should be set to
  appropriate code to perform a redirect.

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
