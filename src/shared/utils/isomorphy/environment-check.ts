// Checks for client- vs. server-side environment detection.

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var REACT_UTILS_FORCE_CLIENT_SIDE: boolean | undefined;
}

/**
 * `true` within client-side environment (browser), `false` at server-side.
 */
export const IS_CLIENT_SIDE: boolean = typeof process !== 'object'
  || !process.versions || !process.versions.node
  || !!global.REACT_UTILS_FORCE_CLIENT_SIDE;

/**
 * `true` within the server-side environment (node), `false` at client-side.
 */
export const IS_SERVER_SIDE: boolean = !IS_CLIENT_SIDE;
