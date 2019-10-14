/**
 * @module time
 * @desc Date & time utilities.
 *
 * In most cases you will rely on JS
 * [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date),
 * and [`moment`](https://momentjs.com/docs/) library for your date & time
 * operations. This module provides a few date & time related things not covered
 * by `Date` and `moment`.
 *
 * Import `time` as
 * ```js
 * import { time } from '@dr.pogodin/react-utils';
 * ```
 * it gives you access to the following constants and functions:
 */

/**
 * One second value [ms].
 */
export const SEC_MS = 1000;

/**
 * One minute value [ms].
 */
export const MIN_MS = 60 * SEC_MS;

/**
 * One hour value [ms].
 */
export const HOUR_MS = 60 * MIN_MS;

/**
 * One day value [ms].
 */
export const DAY_MS = 24 * HOUR_MS;

/**
 * One year value [ms].
 */
export const YEAR_MS = 365 * DAY_MS;

/**
 * Waits for the specified time.
 * @param {Number} timeout Interval duration [ms].
 * @return {Promise} Resolves after the specified timeout.
 */
export async function timer(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
