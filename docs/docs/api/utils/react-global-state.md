# React Global State
```jsx
import {
  getGlobalState,
  getSsrContext,
  GlobalStateProvider,
  useAsyncCollection,
  useAsyncData,
  useGlobalState,
} from '@dr.pogodin/react-utils';
```

For convenience, **react-utils** re-exports components and hooks provided by
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

[client]: /docs/api/functions/client
[server]: /docs/api/functions/server
