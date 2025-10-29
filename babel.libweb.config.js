// PoC: The new way to compile the library for distribution and further Webpack
// consumption. Essentially, it just compiles out TypeScript, and uses Babel
// Module resolver to replace aliased paths. The rest of the bundling will be
// performed by Webpack build of the host code.

/* global module */

module.exports = {
  presets: [
    ['./config/babel/webpack', {
      noRR: true,
      noStyling: true,
      typescript: true,
    }],
  ],
};
