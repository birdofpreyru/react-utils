- [assertClientSide()] &mdash; Throws outside the client-side environment.
- [assertEmptyObject()] &mdash; Asserts the given object is empty,
  both at compile- and runtime.
- [assertServerSide()] &mdash; Throws outside the server-side environment.
- [getConfig()] &mdash; Returns the application configuration object.
- [getBuildInfo()] &mdash; Returns the [build info] object.
- [getBuildTimestamp()] &mdash; Returns the timestamp (ISO string) of
  the frontend build.
- [isDevBuild()] &mdash; Returns **true** if the development build of the code
  is running; **false** otherwise.
- [isProdBuild()] &mdash; Returns **true** if the production build of the code
  is running; **false** otherwise.
- [launchClient()] &mdash; Client-side initialization and launch of ReactJS apps.
- [launchServer()] &mdash; Creates and starts ReactJS server.
- [splitComponent()] &mdash; Wraps a React component for code splitting.
- [withRetries()](/docs/api/functions/withretries) &mdash; Attempts an operation
  multiple times till the first success.

:::caution[Deprecated Functions]
- [client()] &mdash; Renamed into [launchClient()] in [v1.47.0-alpha.8],
  and also moved to a dedicated client-side package export.
- [newBarrier()](/docs/api/functions/newbarrier) &mdash; Deprecated
  in **v1.23.9**, and removed in **v1.24.0**. Instead use [Barrier] constructor
  directly.
- [server()] &mdash; Renamed into [launchServer()] in [v1.47.0-alpha.8],
  and also moved to a dedicated server-side package export.
:::

[assertClientSide()]: /docs/api/functions/assertClientSide
[assertEmptyObject()]: /docs/api/functions/assertEmptyObject
[assertServerSide()]: /docs/api/functions/assertServerSide
[Barrier]: /docs/api/classes/Barrier
[build info]: /docs/api/configs/webpack#build-info
[client()]: /docs/api/functions/client
[getBuildInfo()]: /docs/api/functions/getBuildInfo
[getBuildTimestamp()]: /docs/api/functions/getBuildTimestamp
[getConfig()]: /docs/api/functions/getConfig
[isDevBuild()]: /docs/api/functions/isDevBuild
[isProdBuild()]: /docs/api/functions/isProdBuild
[launchClient()]: /docs/api/functions/launchClient
[launchServer()]: /docs/api/functions/launchServer
[server()]: /docs/api/functions/server
[splitComponent()]: /docs/api/functions/splitComponent
[v1.47.0-alpha.8]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.47.0-alpha.8
