/* global globalThis, window */

import { subtle } from 'node:crypto';
import { TextDecoder, TextEncoder } from 'node:util';

// eslint-disable-next-line import/no-unassigned-import
import 'raf/polyfill';

import { getMockUuid } from '@dr.pogodin/react-utils/jest';

// TODO: This is a temporary polyfill necessary for react-router,
// as JSDom does not provide TextEncoder, see:
// https://github.com/remix-run/react-router/issues/12363
if (!globalThis.TextEncoder || !globalThis.TextDecoder) {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// Polyfill of crypto.subtle in JSDOM environments.
if (typeof window !== 'undefined') {
  window.crypto.subtle = subtle;
  window.isSecureContext = true;
}

let state = 0;
globalThis.crypto.randomUUID = () => getMockUuid(++state);
