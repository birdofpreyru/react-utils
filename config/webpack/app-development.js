/**
 * Development Webpack configuration for ReactJS applications.
 */

const _ = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseFactory = require('./app-base');

/**
 * Creates a new development Webpack config, and performs some auxiliary
 * operations on the way.
 * @param {Object} ops Configuration options. This allows to modify some
 *  frequently changed options in a convenient way, without a need to manipulate
 *  directly with the created config object.
 *
 *  The following options are accepted:
 *
 * @param {String} ops.context Base URL for resolution of relative
 *  config paths.
 *
 * @param {Object|String|String[]} ops.entry Entry points. If an object is
 *  passed, in the "polyfills" entry point will be extended or appended to
 *  include some polyfills we consider obligatory. If a string or an array is
 *  passed in, it will be turned into "main" entry point, and the "polyfills"
 *  entry point will be added to it.
 *
 * @param {String} ops.publicPath Base URL for the output of the build assets.
 */
module.exports = function configFactory(ops) {
  const o = _.defaults(_.clone(ops), {
    cssLocalIdent: '[package]___[path][name]___[local]___[hash:base64:6]',
  });
  const res = merge(baseFactory({
    ...o,
    babelEnv: 'development',
    mode: 'development',
  }), {
    devtool: false,
    output: {
      chunkFilename: '[id].js',
      filename: '[id].js',
    },
    plugins: [
      new MiniCssExtractPlugin({
        chunkFilename: '[id].css',
        filename: '[id].css',
      }),
      new webpack.DefinePlugin({
        'process.env.BABEL_ENV': JSON.stringify('development'),
        'process.env.DEV_TOOLS': JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.REACT_GLOBAL_STATE_DEBUG': JSON.stringify(true),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    snapshot: {
      // This enforces Webpack to watch for possible changes in node_modules
      // dependencies, which is a great convenience in library-centric dev
      // workflows.
      managedPaths: [],
    },
  });
  if (!_.isArray(res.entry.main)) {
    res.entry.main = [res.entry.main];
  }
  res.entry.main = [
    'webpack-hot-middleware/client?reload=true',
  ].concat(res.entry.main);
  res.entry.polyfills.push(
    '@dr.pogodin/react-utils/build/development/client/event-source-polyfill',
    '@dr.pogodin/react-utils/build/development/client/init',
  );
  return res;
};
