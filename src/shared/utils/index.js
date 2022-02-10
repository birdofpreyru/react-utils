import themed, {
  COMPOSE,
  PRIORITY,
  ThemeProvider,
} from '@dr.pogodin/react-themes';

import config from './config';
import * as isomorphy from './isomorphy';
import time from './time';
import * as webpack from './webpack';

export * from './Barrier';
export { default as Emitter } from './Emitter';
export { default as splitComponent } from './splitComponent';

themed.COMPOSE = COMPOSE;
themed.PRIORITY = PRIORITY;

const env = process.env.NODE_CONFIG_ENV || process.env.NODE_ENV;
const JU = env !== 'production' && webpack.requireWeak('./jest', __dirname);

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
  themed,
  ThemeProvider,
  time,
  webpack,
};
