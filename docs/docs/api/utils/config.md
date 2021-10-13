# config
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
    // These configs are available both client- and server-side:
    SAMPLE_KEY: 'sample value',
    SAMPLE_SEGMENT: {
      KEY_1: 'value 1',
      KEY_2: 'value 2',
    },
    SAMPLE CONFIG_KEY_1: 'VALUE',
    CO
  };
  ```
- Some extra fields required for internal workings of `react-utils` library
  may be added to the config.

[node-config]: https://github.com/lorenwest/node-config
