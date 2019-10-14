/**
 * Date & time utilities.
 */

/**
 * Various time intervals expressed in milliseconds.
 */
export const SEC_MS = 1000;
export const MIN_MS = 60 * SEC_MS;
export const HOUR_MS = 60 * MIN_MS;
export const DAY_MS = 24 * HOUR_MS;
export const YEAR_MS = 365 * DAY_MS;

/**
 * Waits for the specified time.
 * @param {Number} timeout Interval duration [ms].
 * @return {Promise} Resolves after the specified timeout.
 */
export async function timer(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
