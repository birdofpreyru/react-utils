// Babel config for compilation of helper scripts (bin-ts-src > bin).

/* global module */

module.exports = {
  plugins: [
    ['@babel/transform-runtime', { useESModules: true }],
  ],
  presets: [
    ['@babel/env', {
      bugfixes: true,
      corejs: '3.49',
      modules: false,
      targets: 'maintained node versions',
      useBuiltIns: 'usage',
    }],
    '@babel/typescript',
  ],
};
