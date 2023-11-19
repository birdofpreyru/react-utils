import themedImpl, {
  type Theme,
  COMPOSE,
  PRIORITY,
  ThemeProvider,
} from '@dr.pogodin/react-themes';

import config from './config';
import * as isomorphy from './isomorphy';
import time from './time';
import * as webpack from './webpack';

import type * as JuT from './jest';

export { Barrier, Emitter, Semaphore } from '@dr.pogodin/js-utils';

export { getSsrContext } from './globalState';
export { default as splitComponent } from './splitComponent';

type ThemedT = typeof themedImpl & {
  COMPOSE: typeof COMPOSE;
  PRIORITY: typeof PRIORITY;
};

const themed: ThemedT = themedImpl as ThemedT;

themed.COMPOSE = COMPOSE;
themed.PRIORITY = PRIORITY;

// Note: it should be done this way, as in some environments
// "process" might not exist, and process.env.NODE_CONFIG_ENV
// not injected by Webpack.
let NODE_CONFIG_ENV;
try {
  NODE_CONFIG_ENV = process.env.NODE_CONFIG_ENV;
} catch { /* noop */ }

const env = NODE_CONFIG_ENV || process.env.NODE_ENV;

const JU: typeof JuT | null = env !== 'production'
  ? webpack.requireWeak('./jest', __dirname) as typeof JuT | null
  : null;

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
export async function withRetries(
  action: () => Promise<unknown>,
  maxRetries = 5,
  interval = 1000,
) {
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
  type Theme,
  config,
  isomorphy,
  JU,
  themed,
  ThemeProvider,
  time,
  webpack,
};