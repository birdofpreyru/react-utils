---
sidebar_class_name: deprecated
---

# config
:::danger Deprecated
The [config] export was deprecated and removed from the library in its [v1.47.0].
Use the [getConfig()] function instead.

**Before**
```ts
import { config } from '@dr.pogodin/react-utils';

console.log(config.SAMPLE_KEY);
```

**Now**
```ts
import { getConfig } from '@dr.pogodin/react-utils';

// Anywhere inside React components you can do the following:
console.log(getConfig(true).SAMPLE_KEY);

// Here the `true` flag tells getConfig() to return the config object
// synchronously, if possible, or to throw an error, if it is not available
// yet. On the server side the config object is always available synchronously
// anywhere in the code; however, on the client-side it is only guaranteed to be
// available synchronously inside React components, assuming the client-side
// is rendered & hydrated by the client() initialization function, provided by
// this library.
//
// Thus, outside React components, inside the code that may be executed
// on the client-side, you should do instead:
void getConfig().then((config) => { console.log(config.SAMPLE_KEY) })

// Or the same written with async/await:
void (async () => {
  const config = await getConfig();
  console.log(config.SAMPLE_KEY);
})();
```
:::

# Original Documentation
_Valid for **@dr.pogodin/react-utils** versions prior to [v1.47.0]._
```js
import { config } from '@dr.pogodin/react-utils';
```
The `config` module provides isomorphic application configuration, based on
the [node-config] library. At the server-side it works just as the [node-config]
library import. At the client side  it is makes the config available in the same
format _via_ config injection into HTML template during the server-side
rendering.

These are two special things about the client-side config:
- Any configuration in the `SECRET` config segment is stripped out before
  the injection into the frontend template by the server-side renderer, thus
  providing a configuration segment where server-side only secrets can be
  stored.

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

- Some extra fields required for internal workings of `react-utils` library
  may be added to the config.

[config]: /docs/api/utils/config
[getConfig()]: /docs/api/functions/getConfig
[node-config]: https://github.com/lorenwest/node-config
[v1.47.0]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.47.0
