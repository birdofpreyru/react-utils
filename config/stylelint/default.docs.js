// This module only contains documentation for "default.json" config.
// TODO: Move it to the actual default config, and rename that to default.js

/**
 * @category Configs
 * @module stylelint
 * @desc
 * Configuration for [Stylelint](https://stylelint.io) (SCSS code linter).
 * At the moment a single Stylelint configuration is provided by `react-utils`,
 * and it just matches the
 * [standard Stylelint config](https://github.com/stylelint/stylelint-config-standard)
 * with a few extra options to ignore some valid rules and selectors not known
 * to Stylelint: `@content`, `@extend`, `@for`, `@include`, `@mixin`, `:global`.
 *
 * To use it, just create the following `.stylelintrc`:
 * ```json
 * {
 *   "extends": "./node_modules/@dr.pogodin/react-utils/config/stylelint/default.json"
 * }
 * ```
 */
