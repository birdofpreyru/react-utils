# Jest
Default configuration for [Jest] testing framework.

:::caution Beware
It does strong assumptions about the host project's code structure: the host
[Jest] configuration in the `/config/jest` folder of host code; the source code
in `/src` folder; build outputs in `/build` folder; _etc._

For a project with different structure it might be easier to compose
the appropriate Jest config from scratch.
:::

To use this default configuration create two files in the `/config/jest` folder
of host project:

```js title="/config/jest/config.js"
const config = require('@dr.pogodin/react-utils/config/jest/default');

// You can tune config as necessary here.

module.exports = config;
```

```js title="/config/jest/setup.js"
import '@dr.pogodin/react-utils/config/jest/setup';
```

After that point to that host config file from the Jest execution command,
_e.g._:
```bash
jest --config config/jest/config.js
```

[Jest]: https://jestjs.io
