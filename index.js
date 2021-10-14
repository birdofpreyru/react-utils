/**
 * Entry point of the library.
 *
 * Depending on NODE_ENV variable, it proxies production or development build of
 * the library.
 */
/* eslint-disable global-require, import/no-dynamic-require,
  import/no-unresolved, no-eval */

let lib;

try {
  if (process.versions.node) {
    lib = process.env.NODE_ENV === 'production'
      ? './build/production' : './build/development';
    lib = eval('require')(lib);
  }
} catch (error) {
  lib = undefined;
}

if (!lib) {
  // NOTE: process.env.NODE_ENV check must be done explicitly here to ensure
  // that webpack is able to optimize out the unncessary branch.
  if (process.env.NODE_ENV === 'production') {
    lib = require('./build/production/web.bundle');
  } else {
    lib = require('./build/development/web.bundle');
  }
}

module.exports = lib;
