import dayjs from 'dayjs';
import { Barrier } from './Barrier';

/**
 * @static
 * @const SEC_MS
 * @desc One second, expressed in milliseconds (equals 1000 ms).
 * @example
 * import { time } from '@dr.pogodin/react-utils';
 * console.log(time.SEC_MS); // Prints: 1000
 */
dayjs.SEC_MS = 1000;

/**
 * @static
 * @const MIN_MS
 * @desc One minute, expressed in milliseconds (equals 60 &times; `SEC_MS`).
 * @example
 * import { time } from '@dr.pogodin/react-utils';
 * console.log(time.MIN_MS); // Prints: 60000
 */
dayjs.MIN_MS = 60 * dayjs.SEC_MS;

/**
 * @static
 * @const HOUR_MS
 * @desc One hour, expressed in milliseconds (equals 60 &times; `MIN_MS`).
 * @example
 * import { time } from '@dr.pogodin/react-utils';
 * console.log(time.HOUR_MS); // Prints: 3600000
 */
dayjs.HOUR_MS = 60 * dayjs.MIN_MS;

/**
 * @static
 * @const DAY_MS
 * @desc One day, expressed in milliseconds (equals 24 &times; `HOUR_MS`).
 * @example
 * import { time } from '@dr.pogodin/react-utils';
 * console.log(time.DAY_MS); // Prints: 86400000
 */
dayjs.DAY_MS = 24 * dayjs.HOUR_MS;

/**
 * @static
 * @const YEAR_MS
 * @desc One year, expressed in milliseconds (equals 365 &times; `DAY_MS`,
 *  thus a normal, non-leap year).
 * @example
 * import { time } from '@dr.pogodin/react-utils';
 * console.log(time.YEAR_MS); // Prints: 31536000000
 */
dayjs.YEAR_MS = 365 * dayjs.DAY_MS;

/**
 * @static
 * @func now
 * @desc Returns Unix timestamp [ms] (thus, it is just an alias for `Date.now`).
 * @return {number}
 * @example
 * import { time } from '@dr.pogodin/react-utils';
 * console.log(time.now()); // Prints the current timestamp, e.g. 1618608761000.
 */
dayjs.now = Date.now;

/**
 * Creates a Promise, which resolves after the given timeout.
 * @param {number} timeout Timeout [ms].
 * @return {Barrier} Resolves after the timeout. It has additional
 *  .abort() method attached, which cancels the pending timer resolution
 *  (without resolving or rejecting the barrier).
 */
dayjs.timer = async function timer(timeout) {
  const res = new Barrier();
  const id = setTimeout(res.resolve.bind(res), timeout);
  res.abort = () => clearTimeout(id);
  return res;
};

export default dayjs;
