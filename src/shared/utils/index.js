import path from 'path';

import * as api from 'axios';
import * as PT from 'prop-types';

import config from './config';
import * as isomorphy from './isomorphy';
import * as redux from './redux';
import time from './time';
import * as url from './url';
import * as webpack from './webpack';

const juUrl = module.webpackPolyfill ? './shared/utils/jest'
  : path.resolve(__dirname, './jest');

const JU = isomorphy.isServerSide()
  && (process.env.NODE_CONFIG_ENV || process.env.NODE_ENV) !== 'production'
  ? webpack.requireWeak(juUrl) : null;

export {
  api,
  config,
  isomorphy,
  JU,
  PT,
  redux,
  time,
  url,
  webpack,
};
