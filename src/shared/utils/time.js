/* global document */

import Cookie from 'cookie';
import dayjs from 'dayjs';
import { noop } from 'lodash';
import { useEffect, useState } from 'react';

import { getSsrContext, useGlobalState } from '@dr.pogodin/react-global-state';

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
export async function timer(timeout) {
  const res = new Barrier();
  if (timeout > 0) {
    const id = setTimeout(res.resolve.bind(res), timeout);
    res.abort = () => clearTimeout(id);
  } else {
    res.abort = noop;
    res.resolve();
  }
  return res;
}

/**
 * This react hook wraps Date.now() function in a SSR friendly way,
 * ensuring that all calls to useCurrent() within the same render return
 * exactly the same time (which is retrieved from Date.now() first, and
 * then stored in the global state to be reused in all other calls), which
 * is also passed and used in the first client side render, and then updated
 * with a finite precision to avoid infinite re-rendering loops.
 * @param {object} [options] Optional settings.
 * @param {string} [options.globalStatePath="currentTime"] Global state path
 *  to keep the current time value.
 * @param {number} [options.precision= 5 * time.SEC_MS] Current time precision.
 *  The hook won't update the current time stored in the global state unless it
 *  is different from Date.now() result by this number (in milliseconds).
 *  Default to 5 seconds.
 * @param {boolean} [options.autorefresh=false] Set `true` to automatically
 *  refresh time stored in the global state with the given `precision` (and
 *  thus automatically re-rendering components dependent on this hook, or
 *  the global state with the period equal to the `precision`.
 * @return {number} Unix timestamp in milliseconds.
 */
export function useCurrent({
  autorefresh = false,
  globalStatePath = 'currentTime',
  precision = 5 * dayjs.SEC_MS,
} = {}) {
  const [now, setter] = useGlobalState(globalStatePath, Date.now);
  useEffect(() => {
    let timerId;
    const update = () => {
      setter((old) => {
        const neu = Date.now();
        return Math.abs(neu - old) > precision ? neu : old;
      });
      if (autorefresh) timerId = setTimeout(update, precision);
    };
    update();
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [autorefresh, precision, setter]);
  return now;
}

/**
 * Returns client's timezone offset (the difference, in milliseconds, between
 * a timestamp evaluated in the user's timezone, and the same moment of time
 * represented as a standard timestamp in UTC timzone) in an SSR-friendly way,
 * i.e. adding the result of this hook to a standard timestamp will shift it
 * in such way that when formatted to a human-readable form it will represent
 * the time in the user's timezone.
 *
 * Technically, on the first ever call at the server-side it returns zero,
 * then at the client side it initially returns zero, then determines the actual
 * timezone offset, returns it from the hook and also sets it as a cookie.
 * Subsequent renders on the server side will use that cookie to report
 * the user's timezone right away.
 *
 * @param {object} [options] Optional settings.
 * @param {string} [options.cookieName="timezoneOffset"] Optional. The name of
 *  cookie to use to store the timezone offset. Defaults "timezoneOffset". Set
 *  to a falsy value to forbid using cookies altogether (in that case the hook
 *  will always return zero value at the server-side, and in the first render
 *  at the client-side).
 * @return {number} Timezone offset.
 */
export function useTimezoneOffset({
  cookieName = 'timezoneOffset',
} = {}) {
  const ssrContext = getSsrContext(false);
  const [offset, setOffset] = useState(() => {
    const value = cookieName && ssrContext?.req?.cookies?.[cookieName];
    return value ? parseInt(value, 10) : 0;
  });
  useEffect(() => {
    const date = new Date();
    const value = -date.getTimezoneOffset() * dayjs.MIN_MS;
    setOffset(value);
    if (cookieName) {
      document.cookie = Cookie.serialize(cookieName, value, { path: '/' });
    }
  }, [cookieName]);
  return offset;
}

dayjs.timer = timer;
dayjs.useCurrent = useCurrent;
dayjs.useTimezoneOffset = useTimezoneOffset;

export default dayjs;
