// Babel config for compilation of helper scripts (bin-ts-src > bin).

export default {
  plugins: [
    '@babel/transform-runtime',
    ['polyfill-corejs3', { method: 'usage-pure', version: '3.49' }],
  ],
  presets: [
    ['@babel/env', { modules: false }],
    '@babel/typescript',
  ],
  targets: 'maintained node versions',
};
