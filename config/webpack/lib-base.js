/**
 * Base Webpack configuration for ReactJS libraries. It is further extended for
 * development and production use in the "lib-development" and "lib-production"
 * configs.
 */

const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { ProgressPlugin } = require('webpack');

/**
 * Creates a new Webpack config object.
 *
 * @param {Object} ops Configuration params. This allows to conveniently set
 *  the options that should be customized for specific libraries.
 *
 * @param {String} ops.babelEnv BABEL_ENV to be used by Babel during the build.
 *
 * @param {object} [ops.babelLoaderOptions] Optional. Overrides for babel-loader
 *  of JSX and SVG files.
 *
 * @param {String} ops.context Base URL for resolution of relative config paths.
 *
 * @param {String} ops.cssLocalIdent Template for CSS classname
 *  generation by css-loader (it will be passed into the "localIdentName" param
 *  of the loader). It should match the corresponding setting in the Babel
 *  config.
 *
 * @param {String} ops.entry Entry point of the library.
 *
 * @param {String} ops.library Name of the library.
 *
 * @param {String} ops.outputPath Output path.
 *
 * @return {Object} Webpack config.
 */
module.exports = function configFactory(ops) {
  return {
    context: ops.context,
    entry: ops.entry,
    externals: [
      /@babel\/runtime/,
      '@dr.pogodin/react-global-state',
      '@dr.pogodin/react-themes',
      '@dr.pogodin/react-utils',
      'axios',
      'dayjs',
      'lodash',
      'prop-types',
      'qs',
      'react',
      /react-dom/,
      'react-helmet',
      /react-hot-loader/,
      'react-router-dom',
      'shortid',
      'url-parse',
    ],
    mode: ops.mode,
    output: {
      filename: 'web.bundle.js',

      // TODO: Check, whether this fix can be dropped.
      // Workaround to fix umd build, restore webpack v3 behaviour
      // https://github.com/webpack/webpack/issues/6677
      // https://github.com/webpack/webpack/issues/6642
      globalObject: "typeof self !== 'undefined' ? self : this",

      library: ops.library,
      path: ops.outputPath,
      libraryTarget: 'umd',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
      new ProgressPlugin(),
    ],
    module: {
      rules: [{
        /* Handles font imports in url(..) instructions in CSS. Effectively,
         * with such configuration it just rewrites those URLs to point to
         * the original location of the font assets in
         * the library being build. */
        test: /\.(eot|otf|svg|ttf|woff2?)$/,
        include: [
          /node_modules/,
          /src[/\\]assets[/\\]fonts/,
        ],
        loader: 'file-loader',
        options: {
          emitFile: true,
          name: '[path][name].[ext]',
          outputPath: '../shared',
          publicPath: `~${ops.library}/build/shared`,
        },
      }, {
        /* Loads JS and JSX moudles, and inlines SVG assets. */
        test: /\.(jsx?|svg)$/,
        exclude: [
          /node_modules/,
          /src[/\\]assets[/\\]fonts/,
        ],
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          envName: ops.babelEnv,
          presets: ['@dr.pogodin/react-utils/config/babel/webpack'],
          ...ops.babelLoaderOptions || {},
        },
      }, {
        /* Loads SCSS stylesheets. */
        test: /\.scss/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              modules: {
                localIdentName: ops.cssLocalIdent,
              },
            },
          }, {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer,
                ],
              },
            },
          }, 'resolve-url-loader', {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      }, {
        /* Loads CSS stylesheets. It is assumed that CSS stylesheets come only
        * from dependencies, as we use SCSS inside our own code. */
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      }],
    },
    resolve: {
      alias: {
        /* Aliases to JS an JSX files are handled by Babel. */
        assets: path.resolve(ops.context, 'src/assets'),
        components: path.resolve(ops.context, 'src/shared/components'),
        fonts: path.resolve(ops.context, 'src/assets/fonts'),
        styles: path.resolve(ops.context, 'src/styles'),
      },
      extensions: ['.js', '.json', '.jsx', '.scss'],
      symlinks: false,
    },
  };
};
