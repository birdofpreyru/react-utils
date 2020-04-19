import path from 'path';

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
import hooks from './hooks';
import time from './time';
import * as url from './url';
import * as webpack from './webpack';

themed.COMPOSE = COMPOSE;
themed.PRIORITY = PRIORITY;

const juUrl = module.webpackPolyfill ? './shared/utils/jest'
  : path.resolve(__dirname, './jest');

const JU = isomorphy.isServerSide()
  && (process.env.NODE_CONFIG_ENV || process.env.NODE_ENV) !== 'production'
  ? webpack.requireWeak(juUrl) : null;

export {
  _,
  api,
  config,
  hooks,
  isomorphy,
  JU,
  PT,
  themed,
  ThemeProvider,
  time,
  url,
  webpack,
};
