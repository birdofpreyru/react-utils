/* eslint-disable import/no-commonjs */
/* global module */

module.exports = {
  plugins: ['babel-plugin-transform-import-meta'],
  presets: [
    ['./config/babel/node-ssr', {
      typescript: true,
    }],
  ],
};
