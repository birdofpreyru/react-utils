/**
 * @category Configs
 * @module webpack/app-production
 * @desc Production Webpack configuration for applications.
 */

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseFactory = require('./app-base');

/**
 * @func factoryConfig
 * @desc
 * ```js
 * const configFactory = require('@dr.pogodin/react-utils/config/webpack/app-production');
 * ```
 * Creates a new production Webpack config, and performs some auxiliary
 * operations on the way. This configuration is based on
 * {@link module:webpack/app-base webpack/app-base}
 * and it differs from that in the following:
 * - *production* Babel environment is enforced;
 * - Emulates the following environment variables:
 *   - **`BABEL_ENV`** &mdash; It is set to *production*;
 *   - **`NODE_ENV`** &mdash; It is set to *production*.
 * - Adds the following plugins:
 *   - [CSS Minimizer Webpack Plugin](https://www.npmjs.com/package/css-minimizer-webpack-plugin);
 *   - [UglifyJsPlugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/).
 * @param {object} ops Accepts same options as the base config.
 * @return {object}
 */
module.exports = function configFactory(ops) {
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
};
