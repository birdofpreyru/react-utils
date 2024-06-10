# client()
```jsx
import { client } from '@dr.pogodin/react-utils';

client(Application, options);
```
Initializes and launches ReactJS `Application` at the client-side.

Namely, it wraps the app with [BrowserRouter] and [GlobalStateProvider],
then hydrates it into DOM element with **react-view** ID, assuming
[the standard SSR setup][server()] was used to generate the initial HTML markup
of the page.

:::info
Behind the scenes, when client-side initialization module is loaded, it checks
the host document for the `<meta>` tag injected by server, carrying app config,
initial global state value, and information about application code chunks and
files belonging to them. If such tag is present, it is consumed by the library.
See [the source code](https://github.com/birdofpreyru/react-utils/blob/a898902751b48fa37b0b4af5f2ba1f4e8743db77/src/shared/utils/globalState.ts#L9-L14)
for the exact typing of that tag's payload.

For server-less usage the same data object might be bundled into an app,
and passed to the library by attaching it to `window.REACT_UTILS_INJECTION`
prior to loading the library.
:::

The `dontHydrate` option allows to opt for a pure client-side rendering, instead
of the hydration.

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