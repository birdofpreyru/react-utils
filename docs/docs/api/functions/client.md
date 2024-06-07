# client()
```jsx
import { client } from '@dr.pogodin/react-utils';

client(Application, options);
```
Initializes and launches ReactJS `Application` at the client-side.

Namely, it wraps the app with [BrowserRouter] and [GlobalStateProvider],
then hydrates it into DOM element with **react-view** ID, assuming
[the standard SSR setup][server()] was used to generate the initial HTML markup of the page.

The `dontHydrate` option allows to opt for a pure client-side rendering, instead
of the hydration.

:::note
Introduced in the library version **v1.35.3**, there is `client.setInj(value)`
method allowing to set a custom &laquo;server-side injection object&raquo;
(it is normally generated and used under-the-hood from server-side data injected
into pages during their server-side rendering, but in the server-less scenario
it is necessary to manually get and set it, to allow for some features,
_e.g._ to support the code splitting). `client.setInj(value)` was added as
a hotfix for an ongoing project, and perhaps the approach to this feature
will be re-considered, and better documented later.
:::

## Arguments
**Required:**
- `Application` - **React.Component** - The root applciation component.

**Optional:**
- `options` - **object** - Additional settings:
  - `dontHydrate` - **boolean** - By default, the app is hydrated into DOM
    element found by **react-view** ID, using React's [hydrateRoot()] functionality,
    and  assuming [the standard SSR setup][server()] was used to generate 
    he initial HTML markup of the page.

    With `dontHydrate` flag set **true** React's [createRoot()] function is used
    instead to perform a clean client-side rendering into the DOM element with
    **react-view** ID.

  - `initialState` &mdash; **object** &mdash; By default the initial global
    state for the app is injected into the front-end from the server-side,
    where it can be customised during each render using the [beforeRender]
    argument of the [server()] initialization function. This `initialState`
    option of [client()] function provides a fallback value for the initial
    global state on the client-side, which is intended for server-less library
    use.

<!-- links -->
[beforeRender]: /docs/api/functions/server#arguments-beforerender
[client()]: #
[BrowserRouter]: https://reactrouter.com/docs/en/v6/api#browserrouter
[GlobalStateProvider]: https://dr.pogodin.studio/docs/react-global-state/docs/api/components/globalstateprovider
[server()]: /docs/api/functions/server
[createRoot()]: https://reactjs.org/docs/react-dom-client.html#createroot
[hydrateRoot()]: https://reactjs.org/docs/react-dom-client.html#hydrateroot