- [assertEmptyObject()] &mdash; Asserts the given object is empty,
  both at compile- and runtime.
- [getConfig()] &mdash; returns the application configuration object.
- [launchClient()] &mdash; Client-side initialization and launch of ReactJS apps.
- [launchServer()] &mdash; Creates and starts ReactJS server.
- [splitComponent()] &mdash; Wraps a React component for code splitting.
- [withRetries()](/docs/api/functions/withretries) &mdash; Attempts an operation
  multiple times till the first success.

:::caution Deprecated Functions
- [client()] &mdash; Renamed into [launchClient()] in [v1.47.0-alpha.8],
  and also moved to a dedicated client-side package export.
- [newBarrier()](/docs/api/functions/newbarrier) &mdash; Deprecated
  in **v1.23.9**, and removed in **v1.24.0**. Instead use [Barrier] constructor
  directly.
- [server()] &mdash; Renamed into [launchServer()] in [v1.47.0-alpha.8],
  and also moved to a dedicated server-side package export.
:::

<!-- links -->
[assertEmptyObject()]: /docs/api/functions/assertEmptyObject
[Barrier]: /docs/api/classes/Barrier
[client()]: /docs/api/functions/client
[getConfig()]: /docs/api/functions/getConfig
[launchClient()]: /docs/api/functions/launchClient
[launchServer()]: /docs/api/functions/launchServer
[server()]: /docs/api/functions/server
[splitComponent()]: /docs/api/functions/splitComponent
[v1.47.0-alpha.8]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.47.0-alpha.8
