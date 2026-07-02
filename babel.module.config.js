/* eslint-disable import/no-commonjs */
/* global module */

export default {
  presets: [
    ['./config/babel/node-ssr', {
      modules: false,
      typescript: true,
    }],
  ],
};
