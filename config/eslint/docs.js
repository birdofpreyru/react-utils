// This file contains JSDoc documentation only. It could live inside config
// files themselves, but it seems ESLint is not happy with extending configs
// placed into JS files.

/**
 * @category Configs
 * @module eslint/default
 * @desc
 * Default [ESLint](https://eslint.org/) configuration. Set it up as:
 * ```
 * // Inside your .eslintrc
 * {
 *   "extends": "./node_modules/@dr.pogodin/react-utils/config/eslint/default.json"
 * }
 * ```
 *
 * Internally this configuration extends
 * [AirBnB ESLint config](https://www.npmjs.com/package/eslint-config-airbnb),
 * overriding just a couple of rules, and seting up Babel parser and module
 * resolver (which are necessary to work alongside Babel configs provided by
 * this library).
 */

/**
 * @category Configs
 * @module eslint/jest
 * @desc
 * [ESLint](https://eslint.org/) configuration for [Jest](https://jestjs.io/)
 * tests. Set it up as:
 * ```
 * // Inside your .eslintrc
 * {
 *   "extends": "./node_modules/@dr.pogodin/react-utils/config/eslint/jest.json"
 * }
 * ```
 *
 * Internally this configuration extends
 * {@link module:eslint/default eslint/default} with a few changes needed
 * to lint tests written for Jest environment.
 */
