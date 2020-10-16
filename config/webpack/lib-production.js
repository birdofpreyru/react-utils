/**
 * Development Webpack configuration for ReactJS libraries.
 */

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const baseFactory = require('./lib-base');

/**
 * Creates a new Webpack config.
 *
 * @param {Object} ops Configuration params. This helps to conveniently set
 * the most useful options. You still can modify other config parameters with
 * help of "webpack-merge", or by a direct mutation of the created config
 * object.
 *
 * @param {String} ops.context Base URL for resolution of relative config
 * paths.
 *
 * @param {String} ops.entry Entry point of the library.
 *
 * @return {Object} Webpack configuration.
 */
module.exports = function configFactory(ops) {
  const baseConfig = baseFactory({
    ...ops,
    babelEnv: 'production',
    cssLocalIdent: '[hash:base64:6]',
    mode: 'production',
    outputPath: path.resolve(__dirname, ops.context, 'build/production'),
  });
  return merge(baseConfig, {
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
};
