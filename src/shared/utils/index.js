import path from 'path';

import config from './config';
import * as isomorphy from './isomorphy';
import * as redux from './redux';
import * as webpack from './webpack';

const juUrl = module.webpackPolyfill ? './shared/utils/jest'
  : path.resolve(__dirname, './jest');

const JU = isomorphy.isServerSide()
  && (process.env.NODE_CONFIG_ENV || process.env.NODE_ENV) !== 'production'
  ? webpack.requireWeak(juUrl) : null;

export {
  config,
  isomorphy,
  JU,
  redux,
  webpack,
};
