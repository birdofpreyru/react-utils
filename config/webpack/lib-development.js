/**
 * @category Configs
 * @module webpack/lib-development
 * @desc
 * Development Webpack config for ReactJS libraries.
 */

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const baseFactory = require('./lib-base');

/**
 * @func configFactory
 * @desc
 * Extends and tunes {@link module:webpack/lib-development lib-development}
 * to use *development* Babel environment, and sets
 * `[path][name]___[local]___[hash:base64:6]`as
 * the template for generated CSS classnames.
 * @param {object} ops
 * @return {object}
 */
module.exports = function configFactory(ops) {
  return merge(
    baseFactory({
      ...ops,
      babelEnv: 'development',
      cssLocalIdent: '[package]___[path][name]___[local]___[hash:base64:6]',
      mode: 'development',
      outputPath: path.resolve(__dirname, ops.context, 'build/development'),
    }),
    {
      plugins: [
        new webpack.DefinePlugin({
          'process.env.BABEL_ENV': JSON.stringify('development'),
          'process.env.NODE_ENV': JSON.stringify('development'),
          'process.env.REACT_GLOBAL_STATE_DEBUG': JSON.stringify(true),
        }),
      ],
      snapshot: {
        // This enforces Webpack to watch for possible changes in node_modules
        // dependencies, which is a great convenience in library-centric dev
        // workflows.
        managedPaths: [],
      },
    },
  );
};
