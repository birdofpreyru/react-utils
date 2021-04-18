/**
 * @category Utilities
 * @module isomorphy
 * @desc
 * ```js
 * import { isomorphy } from '@dr.pogodin/react-utils';
 * ```
 * Collection of helpers for dealing with isomorphic aspects of code
 * (mostly environment checks: client- or server-side, development or
 * production, _etc._).
 *
 * **Beware:** This module relies on Babel and Webpack configurations provided
 * by `react-utils` library being used by the host code, along with provided
 * methods for server creation and client-side app initialization. It won't
 * work correctly with a different app setup.
 */
/* global window */

/**
 * ```js
 * import { isomorphy } from '@dr.pogodin/react-utils';
 * const { IS_CLIENT_SIDE } = isomorphy;
 * ```
 * `true` within client-side environment (browser), `false` at server-side.
 */
export const IS_CLIENT_SIDE = typeof process !== 'object'
  || !process.versions || !process.versions.node;

/**
 * ```js
 * import { isomorphy } from '@dr.pogodin/react-utils';
 * const { IS_SERVER_SIDE } = isomorphy;
 * ```
 * `true` within the server-side environment (node), `false` at client-side.
 */
export const IS_SERVER_SIDE = !IS_CLIENT_SIDE;

/**
 * @ignore
 * @return {string} Code mode: "development" or "production".
 */
function getMode() {
  return process.env.NODE_ENV;
}

/**
 * ```js
 * import { isomorphy } from '@dr.pogodin/react-utils';
 * const { isDevBuild } = isomorphy;
 * ```
 * Returns `true` if development version of the code is running;
 * `false` otherwise.
 * @return {boolean}
 */
export function isDevBuild() {
  return getMode() === 'development';
}

/**
 * ```js
 * import { isomorphy } from '@dr.pogodin/react-utils';
 * const { isProdBuild } = isomorphy;
 * ```
 * Returns `true` if production build of the code is running;
 * `false` otherwise.
 * @return {boolean}
 */
export function isProdBuild() {
  return getMode() === 'production';
}

/**
 * ```js
 * import { isomorphy } from '@dr.pogodin/react-utils';
 * const { getBuildInfo } = isomorphy;
 * ```
 * Returns build info object.
 * @returns {object}
 */
export function getBuildInfo() {
  return (IS_CLIENT_SIDE ? window : global).TRU_BUILD_INFO;
}

/**
 * ```js
 * import { isomorphy } from '@dr.pogodin/react-utils';
 * const { buildTimestamp } = isomorphy;
 * ```
 * Returns build timestamp of the front-end JS bundle.
 * @return {string} ISO date/time string.
 */
export function buildTimestamp() {
  return getBuildInfo().timestamp;
}
