/**
 * Date & time utilities.
 */

import dayjs from 'dayjs';

/**
 * Various time intervals expressed in milliseconds.
 */
dayjs.SEC_MS = 1000;
dayjs.MIN_MS = 60 * dayjs.SEC_MS;
dayjs.HOUR_MS = 60 * dayjs.MIN_MS;
dayjs.DAY_MS = 24 * dayjs.HOUR_MS;
dayjs.YEAR_MS = 365 * dayjs.DAY_MS;

/**
 * Waits for the specified time.
 * @param {Number} timeout Interval duration [ms].
 * @return {Promise} Resolves after the specified timeout.
 */
dayjs.timer = async function timer(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default dayjs;
