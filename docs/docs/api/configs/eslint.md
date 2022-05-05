# ESLint
The library provides default [ESLint] configurations.
- [ESLint](#eslint)
  - [Default](#default)
  - [Jest](#jest)

## Default
Under the hood this is mostly
[AirBnB ESLint config](https://www.npmjs.com/package/eslint-config-airbnb),
with just a few rules modified, and Babel parser, module resolver configured
(in the way compatible with [Babel presets](/docs/api/configs/babel) provided by
this library).

To include it into [ESLint] config:
```json
{
  "extends": "./node_modules/@dr.pogodin/react-utils/config/eslint/default.json"
}
```

The modified rules are:
- [jsx-a11y/anchor-is-valid](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md)
  is configured to be compatible with [Link](/docs/api/components/link)
  components.
- [no-plusplus](https://eslint.org/docs/rules/no-plusplus) is disabled,
  thus allowing unary `++` and `--` operators in JS(X) code.
- [react/jsx-one-expression-per-line](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-one-expression-per-line.md)
  is disabled, thus allowing for multiple JSX expressions in the same line,
  which allows for a way more readable markup in many cases.
- [react/jsx-uses-react](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md)
  and
  [react/react-in-jsx-scope](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md)
  are disabled, as the latest [ReactJS] versions do not require to explicitly
  import `React` into JSX files.

## Jest
This configuration slightly extends [default](#default) config to be used
to lint JS code intended for [Jest] test environment.

To include it into [ESLint] config:
```json
{
  "extends": "./node_modules/@dr.pogodin/react-utils/config/eslint/jest.json"
}
```

On top of [default](#default) configuration this config:
- Enables `browser` and `jest` environment targets, and adds `jest` [ESLint]
  plugin.
- Disables [global-require](https://eslint.org/docs/rules/global-require),
  [import/no-dynamic-require](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-dynamic-require.md), and
  [import/no-extraneous-dependencies](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md)
  rules to allow in tests local and conditional requires, as well as requires of
  development dependencies.
- Disables [no-console](https://eslint.org/docs/rules/no-console) rule,
  allowing console use in tests.

[ESLint]: https://eslint.org
[Jest]: https://jestjs.io
[ReactJS]: https://reactjs.org
