/**
 * Collection of helpers to deal with isomorphic aspects of the code.
 */

/* global window */

export const IS_CLIENT_SIDE = typeof process !== 'object'
  || !process.versions || !process.versions.node;

export const IS_SERVER_SIDE = !IS_CLIENT_SIDE;

/**
 * @return {string} Code mode: "development" or "production".
 */
function getMode() {
  return process.env.NODE_ENV;
}

/**
 * Returns `true` if development version of the code is running;
 * `false` otherwise.
 * @return {boolean}
 */
export function isDevBuild() {
  return getMode() === 'development';
}

/**
 * Returns `true` if production build of the code is running;
 * `false` otherwise.
 * @return {boolean}
 */
export function isProdBuild() {
  return getMode() === 'production';
}

/**
 * Returns build info object.
 * @returns {object}
 */
export function getBuildInfo() {
  return (IS_CLIENT_SIDE ? window : global).TRU_BUILD_INFO;
}

/**
 * Returns build timestamp of the front-end JS bundle.
 * @return {string} ISO date/time string.
 */
export function buildTimestamp() {
  return getBuildInfo().timestamp;
}
