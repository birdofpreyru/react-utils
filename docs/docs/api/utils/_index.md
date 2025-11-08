
- [isomorphy](/docs/api/utils/isomorphy) - Helpers for isomorphic code logic.
- [Jest Utils](/docs/api/utils/jest-utils) &mdash; Helpers useful in [Jest] tests.
- [React Global State](/docs/api/utils/react-global-state) - Aliases for
  [react-global-state](https://dr.pogodin.studio/docs/react-global-state/index.html)
  lib.
- [Server-side utilities](/docs/api/utils/server) &mdash; Server-side constants and functions.
- [themed](/docs/api/utils/themed) - Aliases for
  [React Themes](https://dr.pogodin.studio/docs/react-themes) library.
- [time](/docs/api/utils/time) - Date & time utils.
- [webpack](/docs/api/utils/webpack) - [Webpack]-related utils.

:::warning Deprecated Utilities
- [api](/docs/api/utils/api) &mdash; It was just an alias for [axios] library;
  it has been removed in **v1.39.0**; use [axios] directly instead.
- [PT (prop-types)](/docs/api/utils/prop-types) &mdash; Removed in **v1.36.0**,
  as `propTypes` checks are ignored by React v19+. Migrate to TypeScript,
  or alternative type-checking solutions.
- [config](/docs/api/utils/config) &mdash; Isomorphic app config. Removed in
  [v1.47.0], use the [getConfig()] function instead.
:::

<!-- links -->
[axios]: https://www.npmjs.com/package/axios
[ESLint]: https://eslint.org
[getConfig()]: /docs/api/functions/getConfig
[Jest]: https://jestjs.io
[prop-types]: https://www.npmjs.com/package/prop-types
[Stylelint]: https://stylelint.io
[Webpack]: https://webpack.js.org
[v1.47.0]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.47.0
