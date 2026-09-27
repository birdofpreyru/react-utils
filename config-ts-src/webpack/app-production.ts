/**
 * @category Configs
 * @module webpack/app-production
 * @desc Production Webpack configuration for applications.
 */

/* eslint-disable import/no-extraneous-dependencies */

import webpack, { type Configuration } from 'webpack';
import { merge } from 'webpack-merge';

import baseFactory, { type OptionsT as BaseOptionsT } from './app-base.js';

type OptionsT = BaseOptionsT;

/**
 * @param {object} ops
 * @param {string} ops.context Base URL for resolution of relative config paths.
 * @param {boolean} [ops.dontEmitBuildInfo] If set the `.build-info` file won't
 * be created at the disk during the compilation.
 */
export default function configFactory(ops: OptionsT): Configuration {
  const entry = [
    '@dr.pogodin/react-utils/build/production/client/init',
    ...Array.isArray(ops.entry) ? ops.entry : [ops.entry],
  ];

  const res = merge(baseFactory({
    babelLoaderExclude: [],
    ...ops,
    babelEnv: 'production',
    babelLoaderOptions: {
      compact: true,
      ...ops.babelLoaderOptions,
    },
    entry,
    mode: 'production',
  }), {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BABEL_ENV': JSON.stringify('production'),
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  });

  return res;
}
