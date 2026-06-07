import { getBuildInfo } from './buildInfo';

export * from './environment-check';

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
 */
export function isDevBuild(): boolean {
  return getMode() === 'development';
}

/**
 * Returns `true` if production build of the code is running;
 * `false` otherwise.
 */
export function isProdBuild(): boolean {
  return getMode() === 'production';
}

/**
 * Returns build timestamp of the front-end JS bundle.
 * @return ISO date/time string.
 */
export function buildTimestamp(): string {
  return getBuildInfo().timestamp;
}

export { getBuildInfo };
