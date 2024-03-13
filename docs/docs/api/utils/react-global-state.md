# React Global State
```ts
import {
  type AsyncCollectionLoaderT,
  type AsyncDataEnvelopeT,
  type AsyncDataLoaderT,
  type ForceT,
  type UseAsyncDataOptionsT,
  type UseAsyncDataResT,
  type UseGlobalStateResT,
  type ValueOrInitializerT,
  getGlobalState,
  getSsrContext,
  GlobalStateProvider,
  newAsyncDataEnvelope,
  useAsyncCollection,
  useAsyncData,
  useGlobalState,
  withGlobalStateType,
} from '@dr.pogodin/react-utils';
```

For convenience, **react-utils** re-exports components, hooks, and types provided by
[@dr.pogodin/react-global-state](https://dr.pogodin.studio/docs/react-global-state/index.html)
library, which  is a state of the art library for the global state and
asynchronous data managment in React applications, powered by hooks and Context
API. It is simple, efficient, and with a full server-side rendering (SSR)
support.

The standard [client] and [server] setups provided by **react-utils**
automatically wrap the app into `<GlobalStateProvider>`, also the [server] wires
**react-global-state** to **react-utils** SSR setup, and also exposes the actual
incoming HTTP request object via SSR context, attaching it as `req` field to
the context.

:::info
In case of the `getSsrContext()` hook the exported version has a modified typing,
compared to that of the original
[getSsrContext()](https://dr.pogodin.studio/docs/react-global-state/docs/api/hooks/getssrcontext),
to reflect that it returns an extended version of
[SsrContext](https://dr.pogodin.studio/docs/react-global-state/docs/api/classes/ssrcontext)
class, with `chunkGroups`, `chunks`, `req`, and `status` fields added by
the library's SSR setup.
:::

[client]: /docs/api/functions/client
[server]: /docs/api/functions/server
