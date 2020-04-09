/**
 * Collection of helpers to deal with isomorphic aspects of the code.
 */

/* global window */

/**
 * Returns `true` when executed at the front end side; `false` otherwise.
 * @return {boolean}
 */
export function isClientSide() {
  return typeof window !== 'undefined' && Boolean(window.TRU_FRONT_END);
}

/**
 * Returns `true` if executed at the server side; `false` otherwise.
 * @return {boolean}
 */
export function isServerSide() {
  return typeof window === 'undefined' || !window.TRU_FRONT_END;
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
  return (isClientSide() ? window : global).TRU_BUILD_INFO;
}

/**
 * Returns build timestamp of the front-end JS bundle.
 * @return {string} ISO date/time string.
 */
export function buildTimestamp() {
  return getBuildInfo().timestamp;
}
