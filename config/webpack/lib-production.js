/**
 * @category Configs
 * @module webpack/lib-production
 * @desc
 * Production Webpack config for ReactJS libraries.
 */

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const baseFactory = require('./lib-base');

/**
 * @func configFactory
 * @desc
 * Extends and tunes {@link module:webpack/lib-production lib-production}
 * to use *production* Babel environment, and sets `[hash:base64:6]` as
 * the template for generated CSS classnames.
 * @param {object} ops
 * @return {object}
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
};
