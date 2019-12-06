/**
 * Entry point of the library.
 *
 * Depending on NODE_ENV variable, it proxies production or development build of
 * the library.
 */
/* eslint-disable global-require, import/no-dynamic-require,
  import/no-unresolved */
/* global window */

const IS_PROD = process.env.NODE_ENV === 'production';
const IS_NODE = typeof window === 'undefined' || !window.TRU_FRONT_END;

if (IS_PROD) {
  module.exports = IS_NODE ? require('./build/production')
    : require('./build/production/web.bundle.js');
} else {
  module.exports = IS_NODE ? require('./build/development')
    : require('./build/development/web.bundle.js');
}
