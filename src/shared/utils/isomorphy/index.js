import { getBuildInfo } from './buildInfo';
import { IS_CLIENT_SIDE, IS_SERVER_SIDE } from './environment-check';

/**
 * @ignore
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
 * Returns build timestamp of the front-end JS bundle.
 * @return {string} ISO date/time string.
 */
export function buildTimestamp() {
  return getBuildInfo().timestamp;
}

export { IS_CLIENT_SIDE, IS_SERVER_SIDE, getBuildInfo };
