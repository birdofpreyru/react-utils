/* eslint-disable global-require, import/no-extraneous-dependencies */
/* global globalThis */

import 'raf/polyfill';

// TODO: This is a temporary polyfill necessary for react-router,
// as JSDom does not provide TextEncoder, see:
// https://github.com/remix-run/react-router/issues/12363
if (!globalThis.TextEncoder || !globalThis.TextDecoder) {
  const { TextDecoder, TextEncoder } = require('node:util');
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}
