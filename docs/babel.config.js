/* global module, require */

module.exports = {
  plugins: [['babel-plugin-transform-import-meta'/* , { module: 'ES6' } */]],
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
};
