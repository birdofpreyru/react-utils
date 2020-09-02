import path from 'path';

import _ from 'lodash';

import { useGlobalState, useAsyncData } from '@dr.pogodin/react-global-state';

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

themed.COMPOSE = COMPOSE;
themed.PRIORITY = PRIORITY;

const juUrl = module.webpackPolyfill ? './shared/utils/jest'
  : path.resolve(__dirname, './jest');

const JU = isomorphy.IS_SERVER_SIDE
  && (process.env.NODE_CONFIG_ENV || process.env.NODE_ENV) !== 'production'
  ? webpack.requireWeak(juUrl) : null;

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
  useAsyncData,
  useGlobalState,
  webpack,
};
