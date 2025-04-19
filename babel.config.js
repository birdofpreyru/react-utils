/* eslint-disable import/no-commonjs */
/* global module */

module.exports = {
  presets: [
    ['./config/babel/node-ssr', {
      typescript: true,
    }],
  ],
};
