/* global document */

import Cookie from 'cookie';
import dayjs from 'dayjs';
import { assign } from 'lodash';
import { useEffect } from 'react';

import {
  DAY_MS,
  HOUR_MS,
  MIN_MS,
  SEC_MS,
  YEAR_MS,
  timer,
} from '@dr.pogodin/js-utils';

import { useGlobalState } from '@dr.pogodin/react-global-state';

import { getSsrContext } from './globalState';

type TimeT = typeof dayjs & {
  DAY_MS: typeof DAY_MS;
  HOUR_MS: typeof HOUR_MS;
  MIN_MS: typeof MIN_MS;
  SEC_MS: typeof SEC_MS;
  YEAR_MS: typeof YEAR_MS;
  timer: typeof timer;
};

const time: TimeT = dayjs as TimeT;
time.DAY_MS = DAY_MS;
time.HOUR_MS = HOUR_MS;
time.MIN_MS = MIN_MS;
time.SEC_MS = SEC_MS;
time.YEAR_MS = YEAR_MS;
time.timer = timer;

/**
 * This react hook wraps Date.now() function in a SSR friendly way,
 * ensuring that all calls to useCurrent() within the same render return
 * exactly the same time (which is retrieved from Date.now() first, and
 * then stored in the global state to be reused in all other calls), which
 * is also passed and used in the first client side render, and then updated
 * with a finite precision to avoid infinite re-rendering loops.
 * @param [options] Optional settings.
 * @param [options.globalStatePath="currentTime"] Global state path
 *  to keep the current time value.
 * @param [options.precision= 5 * time.SEC_MS] Current time precision.
 *  The hook won't update the current time stored in the global state unless it
 *  is different from Date.now() result by this number (in milliseconds).
 *  Default to 5 seconds.
 * @param [options.autorefresh=false] Set `true` to automatically
 *  refresh time stored in the global state with the given `precision` (and
 *  thus automatically re-rendering components dependent on this hook, or
 *  the global state with the period equal to the `precision`.
 * @return Unix timestamp in milliseconds.
 */
// TODO: Should we request the state type as generic parameter, to be able
// to verify the give globalStatePath is correct?
export function useCurrent({
  autorefresh = false,
  globalStatePath = 'currentTime',
  precision = 5 * time.SEC_MS,
} = {}) {
  const [now, setter] = useGlobalState<1, number>(globalStatePath, Date.now);
  useEffect(() => {
    let timerId: NodeJS.Timeout;
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
 * Wraps the standard Date.getTimezoneOffset() method in a SSR-friendly way.
 * This hook retrieves the offset value at the client side and uses a cookie
 * to pass it to the server in subsequent requests from that user. At the server
 * side the value from cookie is used in renders and passed back to the client
 * via the global state. Prior to the value being known (in the very first
 * request from the user, when the cookie is still missing), zero value is used
 * as the default value.
 *
 * @param {object} [options] Optional settings.
 * @param {string} [options.cookieName="timezoneOffset"] Optional. The name of
 *  cookie to use to store the timezone offset. Defaults "timezoneOffset". Set
 *  to a falsy value to forbid using cookies altogether (in that case the hook
 *  will always return zero value at the server-side, and in the first render
 *  at the client-side).
 * @param {string} [options.timezoneOffset="timezoneOffset"] Optional.
 *  The global state path to store the offset. Defaults "timezoneOffset".
 * @return {number} Timezone offset.
 */
// TODO: Should we request the state type as generic parameter, to be able
// to verify the give globalStatePath is correct?
export function useTimezoneOffset({
  cookieName = 'timezoneOffset',
  globalStatePath = 'timezoneOffset',
} = {}) {
  const ssrContext = getSsrContext(false);
  const [offset, setOffset] = useGlobalState<1, number>(globalStatePath, () => {
    const value = cookieName && ssrContext?.req?.cookies?.[cookieName];
    return value ? parseInt(value, 10) : 0;
  });
  useEffect(() => {
    const date = new Date();
    const value = date.getTimezoneOffset();
    setOffset(value);
    if (cookieName) {
      document.cookie = Cookie.serialize(cookieName, value.toString(), { path: '/' });
    }
  }, [cookieName, setOffset]);
  return offset;
}

assign(dayjs, {
  DAY_MS,
  HOUR_MS,
  MIN_MS,
  SEC_MS,
  YEAR_MS,
  now: Date.now,
  timer,
  useCurrent,
  useTimezoneOffset,
});

export default time;
