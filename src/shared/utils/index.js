import themed, {
  COMPOSE,
  PRIORITY,
  ThemeProvider,
} from '@dr.pogodin/react-themes';

import config from './config';
import * as isomorphy from './isomorphy';
import time from './time';
import * as webpack from './webpack';

export { default as Emitter } from './Emitter';

themed.COMPOSE = COMPOSE;
themed.PRIORITY = PRIORITY;

let JU = null; // eslint-disable-line import/no-mutable-exports
if (isomorphy.IS_SERVER_SIDE
  && (process.env.NODE_CONFIG_ENV || process.env.NODE_ENV) !== 'production'
) {
  /* eslint-disable global-require */
  const path = webpack.requireWeak('path');
  JU = webpack.requireWeak(path.resolve(__dirname, './jest'));
  /* eslint-enable global-require */
}

/**
 * @category Utilities
 * @func newBarrier
 * @global
 * @desc
 * ```js
 * import { newBarrier } from '@dr.pogodin/react-utils';
 * ```
 * Creates a new async barrier: a Promise instance with its resolve method
 * attached as `.resolve` field.
 * @return {Promise}
 * @example
 * import { newBarrier } from '@dr.pogodin/react-utils';
 * (async () => {
 *   const barrier = newBarrier();
 *   setTimeout(() => barrier.resolve(), 5000);
 *   await barrier;
 *   console.log('This will be printed only after the timeout fires.');
 * })();
 */
function newBarrier() {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  promise.resolve = resolve;
  return promise;
}

/**
 * @category Utilities
 * @global
 * @func withRetries
 * @desc
 * ```js
 * import { withRetries } from '@dr.pogodin/react-utils';
 * ```
 * Attempts to perform given asynchronous `action` up to `maxRetries` times,
 * with the given `interval` between attempts. If any attempt is successful,
 * the result is returned immediately, with no further attempts done;
 * otherwise, if all attempts fail, the result Promise rejects after the last
 * attempt.
 * @param {function} action
 * @param {number} [maxRetries=5] Optional. Maximum number of retries. Defaults
 *  to 5 attempts.
 * @param {number} [interval=1000] Optional. Interval between retries [ms].
 *  Defaults to 1 second.
 * @return {Promise} Resolves to the result of successful operation, or
 *  rejects with the error from the latst failed attempt.
 * @example
 * import { withRetries } from '@dr.pogodin/react-utils';
 *
 * let firstCall = true;
 *
 * function sampleAction() {
 *   if (!firstCall) return 'success';
 *   firstCall = false;
 *   throw Error('The first call to this method fails');
 * }
 *
 * withRetries(sampleAction).then(console.log);
 * // It will print 'success' after one second, once the second attempt
 * // is performed.
 */
export async function withRetries(action, maxRetries = 5, interval = 1000) {
  /* eslint-disable no-await-in-loop */
  for (let n = 1; ; ++n) {
    try {
      return await action();
    } catch (error) {
      if (n < maxRetries) await time.timer(interval);
      else throw error;
    }
  }
  /* eslint-enable no-await-in-loop */
}

export {
  config,
  isomorphy,
  JU,
  newBarrier,
  themed,
  ThemeProvider,
  time,
  webpack,
};
