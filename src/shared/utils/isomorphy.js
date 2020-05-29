/**
 * Collection of helpers to deal with isomorphic aspects of the code.
 */

/* global window */

export const IS_CLIENT_SIDE = typeof process !== 'object'
  || !process.versions || !process.versions.node;

export const IS_SERVER_SIDE = !IS_CLIENT_SIDE;

/* TODO: Deprecated. */
/**
 * Returns `true` when executed at the front end side; `false` otherwise.
 * @return {boolean}
 */
export function isClientSide() {
  console.warn('[react-utils]: isomorphy.isClientSide() is deprecated.');
  return IS_CLIENT_SIDE;
}

/* TODO: Deprecated. */
/**
 * Returns `true` if executed at the server side; `false` otherwise.
 * @return {boolean}
 */
export function isServerSide() {
  console.warn('[react-utils]: isomorphy.isServerSide() is deprecated.');
  return IS_SERVER_SIDE;
}

/**
 * Throws if called outside the client-side environment.
 */
export function assertClientSide() {
  if (!isClientSide()) throw Error('Illegal outside the client side.');
}

/**
 * Throws if called outside the server-side environment.
 */
export function assertServerSide() {
  if (!isServerSide()) throw Error('Illegal outside the server side.');
}

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
