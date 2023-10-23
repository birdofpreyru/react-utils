/**
 * @category Configs
 * @module webpack/app-production
 * @desc Production Webpack configuration for applications.
 */

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack, { type Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import baseFactory, { type OptionsT as BaseOptionsT } from './app-base';

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
    ...ops,
    babelEnv: 'production',
    entry,
    mode: 'production',
  }), {
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
      new MiniCssExtractPlugin({
        chunkFilename: '[contenthash].css',
        filename: '[contenthash].css',
      }),
    ],
  });

  return res;
}
