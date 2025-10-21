// Checks for client- vs. server-side environment detection.

/**
 * `true` within client-side environment (browser), `false` at server-side.
 */
export const IS_CLIENT_SIDE: boolean = typeof process !== 'object'
  // NOTE: Because in this case we assume the host environment might be partially
  // polyfilled to emulate some Node interfaces, thus it might have global `process`
  // object, but without `versions` sub-object inside it.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  || !process.versions?.node
  || !!global.REACT_UTILS_FORCE_CLIENT_SIDE
  || typeof REACT_UTILS_WEBPACK_BUNDLE !== 'undefined';

/**
 * `true` within the server-side environment (node), `false` at client-side.
 */
export const IS_SERVER_SIDE: boolean = !IS_CLIENT_SIDE;
