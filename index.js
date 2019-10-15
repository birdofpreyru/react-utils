/**
 * Entry point of the library.
 *
 * Depending on NODE_ENV variable, it proxies production or development build of
 * the library.
 */
/* eslint-disable global-require, import/no-unresolved */

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/production/web.bundle.js');
} else {
  module.exports = require('./build/development/web.bundle.js');
}
