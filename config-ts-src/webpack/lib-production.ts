// Production Webpack config for ReactJS libraries.

/* eslint-disable import/no-extraneous-dependencies */

import path from 'path';

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import webpack from 'webpack';
import { merge } from 'webpack-merge';

import baseFactory, { type OptionsT as BaseOptionsT } from './lib-base';

type OptionsT = BaseOptionsT;

export default function configFactory(ops: OptionsT): webpack.Configuration {
  const { outputPath = 'build/production' } = ops;

  const baseConfig = baseFactory({
    ...ops,
    babelEnv: 'production',
    cssLocalIdent: '[hash:base64:6]',
    mode: 'production',
    outputPath: path.resolve(__dirname, ops.context, outputPath),
  });
  return merge(baseConfig, {
    devtool: 'source-map',
    optimization: {
      minimizer: [
        '...',
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default', {
              /* Due to the way our styles are organized, these dangerous
              * optimizations can break our styles, thus they are disabled. */
              discardUnused: false,
              reduceIdents: false,
              zindex: false,
            }],
          },
        }),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BABEL_ENV': JSON.stringify('production'),
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  });
}
