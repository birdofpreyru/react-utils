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
};
