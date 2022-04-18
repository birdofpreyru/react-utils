# client()
```jsx
import { client } from '@dr.pogodin/react-utils';

client(Application, options);
```
Initializes and launches ReactJS `Application` at the client-side.

Namely, it wraps the app with [BrowserRouter] and [GlobalStateProvider],
then hydrates it into DOM element with **react-view** ID, assuming
[the standard SSR setup] was used to generate the initial HTML markup of the page.

The `dontHydrate` option allows to opt for a pure client-side rendering, instead
of the hydration.

## Arguments
- `Application` - **React.Component** - The root applciation component.
- `options` - **object** - Optional. Additional settings:
  - `dontHydrate` - **boolean** - By default, the app is hydrated into DOM
    element found by **react-view** ID, using React's [hydrateRoot()] functionality,
    and  assuming [the standard SSR setup] was used to generate the initial HTML markup of the page.

    With `dontHydrate` flag set **true** React's [createRoot()] function is used
    instead to perform a clean client-side rendering into the DOM element with
    **react-view** ID.

<!-- links -->
[BrowserRouter]: https://reactrouter.com/docs/en/v6/api#browserrouter
[GlobalStateProvider]: https://dr.pogodin.studio/docs/react-global-state/docs/api/components/globalstateprovider
[the standard SSR setup]: /docs/api/functions/server
[createRoot()]: https://reactjs.org/docs/react-dom-client.html#createroot
[hydrateRoot()]: https://reactjs.org/docs/react-dom-client.html#hydrateroot