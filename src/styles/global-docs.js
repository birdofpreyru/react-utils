/**
 * @category Styling
 * @module Global_Styles
 * @desc
 * Provides global CSS styles good to have in any application.
 *
 * To set it up add to the root JS(X) module of your application the following
 * conditional require block (different CSS files are required for production
 * and development environments to have minified code in production, but keep
 * verbose code in development, for the ease of debugging):
 * ```js
 * if (process.env.NODE_ENV === 'production') {
 *   require('topcoder-react-utils/build/production/style.css');
 * } else {
 *   require('topcoder-react-utils/build/development/style.css');
 * }
 * ```
 *
 * Keep in mind that when `import` and `require()` statements are mixed within
 * the same JS module, `import` are hoisted on top, and for the global CSS being
 * added before any other styling, you must to have those requires performed
 * before any other imports.
 *
 * Under the hood this global CSS:
 * - Includes [Eric Meyer's "Reset CSS" 2.0](https://meyerweb.com/eric/tools/css/reset/).
 * - Enables `geometryPrecision` for the text rendering quality.
 */
