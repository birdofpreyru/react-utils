import { serialize } from 'cookie';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import {
  DAY_MS,
  HOUR_MS,
  MIN_MS,
  SEC_MS,
  YEAR_MS,
  timer,
} from '@dr.pogodin/js-utils';

import { type ForceT, useGlobalState } from '@dr.pogodin/react-global-state';

import { getSsrContext } from './globalState';

/**
 * This react hook wraps Date.now() function in a SSR friendly way,
 * ensuring that all calls to useCurrent() within the same render return
 * exactly the same time (which is retrieved from Date.now() first, and
 * then stored in the global state to be reused in all other calls), which
 * is also passed and used in the first client side render, and then updated
 * with a finite precision to avoid infinite re-rendering loops.
 */
// TODO: Should we request the state type as generic parameter, to be able
// to verify the give globalStatePath is correct?
export function useCurrent({
  autorefresh = false,
  globalStatePath = 'currentTime',
  precision = 5 * SEC_MS,
} = {}): number {
  const [now, setter] = useGlobalState<ForceT, number>(
    globalStatePath,
    Date.now,
  );
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
 */
// TODO: Should we request the state type as generic parameter, to be able
// to verify the give globalStatePath is correct?
export function useTimezoneOffset({
  cookieName = 'timezoneOffset',
  globalStatePath = 'timezoneOffset',
} = {}): number {
  const ssrContext = getSsrContext(false);
  const [offset, setOffset] = useGlobalState<ForceT, number>(
    globalStatePath,
    () => {
      const value = cookieName
        && ssrContext?.req?.cookies?.[cookieName] as string;
      return value ? parseInt(value, 10) : 0;
    },
  );
  useEffect(() => {
    const date = new Date();
    const value = date.getTimezoneOffset();
    setOffset(value);
    if (cookieName) {
      document.cookie = serialize(cookieName, value.toString(), { path: '/' });
    }
  }, [cookieName, setOffset]);
  return offset;
}

const time = {
  DAY_MS,
  HOUR_MS,
  MIN_MS,
  SEC_MS,
  YEAR_MS,
  now: Date.now,
  timer,
  useCurrent,
  useTimezoneOffset,
};

export default Object.assign(dayjs, time);
