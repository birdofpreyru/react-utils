# ESLint

This library provides a standard [ESLint] configuration for host projects.
It is based on [eslint-configs] configurations, tuned for path coventions
assumed for this library and its host projects. To use it, do the following
in your `eslint.config.mjs`:

```js
// eslint.config.mjs

import config from '@dr.pogodin/react-utils/config/eslint/default';

// Exported `config` is a flat ESLint configuration, intended for ESLint v9+,
// you may further tune / customize it here, and then just export the resulting
// config as the default from this module.

export default config;
```

:::warning History
- [v1.43.0](https://github.com/birdofpreyru/react-utils/releases/tag/v1.42.0) &mdash;
  we have replaced the two legacy [ESLint] configs (`default` and `jest`),
  exported by the library before, and based on AirBnB ESLint configurations,
  by a single, combined, flat config for [ESLint] v9+, based on our new
  [eslint-configs] project.
:::

[ESLint]: https://eslint.org
[eslint-configs]: https://github.com/birdofpreyru/eslint-configs
