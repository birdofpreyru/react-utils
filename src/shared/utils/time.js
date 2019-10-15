/**
 * Date & time utilities.
 */

import moment from 'moment';

/**
 * Various time intervals expressed in milliseconds.
 */
moment.SEC_MS = 1000;
moment.MIN_MS = 60 * moment.SEC_MS;
moment.HOUR_MS = 60 * moment.MIN_MS;
moment.DAY_MS = 24 * moment.HOUR_MS;
moment.YEAR_MS = 365 * moment.DAY_MS;

/**
 * Waits for the specified time.
 * @param {Number} timeout Interval duration [ms].
 * @return {Promise} Resolves after the specified timeout.
 */
moment.timer = async function timer(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default moment;
