# Stylelint
Default configuration for [Stylelint] (S)CSS code linter. It mostly follows
the [standard Stylelint config](https://github.com/stylelint/stylelint-config-standard)
with just a few modifications:
- It whitelist some valid expressions unknown to [Stylelint]:
  `@content`, `@each`, `@extend`, `@for`, `@include`, `@mixin`,
  `@use`, `:global`.
- It allows both `camelCase` and `kebab-case` for CSS identifiers.

To use it include into `.stylelintrc` config:

```json
{
  "extends": "./node_modules/@dr.pogodin/react-utils/config/stylelint/default"
}
```

[Stylelint]: https://stylelint.io
