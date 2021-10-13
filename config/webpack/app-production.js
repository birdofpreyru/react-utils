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
