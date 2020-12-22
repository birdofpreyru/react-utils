import _ from 'lodash';

import themed, {
  COMPOSE,
  PRIORITY,
  ThemeProvider,
} from '@dr.pogodin/react-themes';

import api from 'axios';
import * as PT from 'prop-types';

import config from './config';
import * as isomorphy from './isomorphy';
import time from './time';
import * as url from './url';
import * as webpack from './webpack';

export { useGlobalState, useAsyncData } from '@dr.pogodin/react-global-state';

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
 * Creates a new async barrier: a Promise instance with its resolve method
 * attached as .resolve field.
 * @return {Promise<>}
 */
function newBarrier() {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  promise.resolve = resolve;
  return promise;
}

/**
 * Attempts to execute provided async "action" up to "maxRetries" time with
 * the given "interval". If any of attempts is successful it returns its result,
 * otherwise if all attempts fail it throws the error of last attempt.
 * @param {function} action
 * @param {number} [maxRetries=5] Optional. Maximum number of retries. Defaults
 *  to 5 attempts.
 * @param {number} [interval=1000] Optional. Interval between retries [ms].
 *  Defaults to 1 second.
 * @return {Promise} Resolves to the result of successful operation, or
 *  rejects with the error from the latst failed attempt.
 */
async function withRetries(action, maxRetries = 5, interval = 1000) {
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
  _,
  api,
  config,
  isomorphy,
  JU,
  newBarrier,
  PT,
  themed,
  ThemeProvider,
  time,
  url,
  webpack,
  withRetries,
};
