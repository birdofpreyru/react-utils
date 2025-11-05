# getConfig()
[getConfig()]: /docs/api/functions/getConfig
```ts
import { getConfig } from '@dr.pogodin/react-utils';

type ConfigT = Record<string, unknown>;

function getConfig(): ConfigT | Promise<ConfigT>;
```

:::tip
In the next update will add optional `sync` flag to this function,
which will guarantee that the function either returns `ConfigT` object
synchronously, or throws if it is not available yet. This function will
help to synchronously get the configuration inside component rendering
code (where usage of a possibly asynchronous function may otherwise
be cumbersome).
:::

The [getConfig()] function returns the isomorphic (available both at the server-
and the client-side) application configuration object, or a promise that resovles
to that object.

At the server side this configuration object is provided by the [node-config]
library, it is always available synchronously (_i.e._ this function always
returns the object, rather than its promise), and it essentially behaves
the same as the direct [node-config] library import.

For the client side this configuration object is made available _via_
injection into HTML template during the server-side rendering. This injection
is decoded during the client-side application initialization by the [client()]
function, and is returned from [getConfig()] as the configuration object. For
all client-side calls to [getConfig()] inside React components it is guaranteed
that the configuration object is returned directly (because [client()] waits for
the injection decoding prior to start the rendering & hydration of React tree); 
however calls to [getConfig()] elsewhere in the code, if done prior to
the injection having been processed, will result in [getConfig()] returning
a promise that resolves to the injected configuration object, once it is
available.

Also, prior to the configuration object injection, the server side strips
from the injected config the `SECRET` segment, if present, thus providing
a configuration segment where server-side only secret can be stored

**Example**
```js title="/config/default.json"
module.exports = {
  // These configuration entries are available both client- and server-side:
  SAMPLE_KEY: 'sample value',
  SAMPLE_SEGMENT: {
    KEY_1: 'value 1',
    KEY_2: 'value 2',
  },

  // This entire segment is only available at the server-side,
  // and it is automatically stripped away from the configuration object
  // injected into the client-side.
  SECRET: {
    SERVER_SIDE_SECRET: 'secret value',
  },
}
```

Also, our library may add some extra fields to the config loaded by [node-config];
for example it automatically adds `CSRF` token field to the configuration injected
into the client-side code.

[client()]: /docs/api/functions/client
[node-config]: https://github.com/lorenwest/node-config
