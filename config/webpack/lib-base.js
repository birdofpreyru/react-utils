/**
 * @category Configs
 * @module webpack/lib-base
 * @desc
 * Base Webpack config for ReactJS libraries.
 */
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { ProgressPlugin } = require('webpack');

const { getLocalIdent } = require('../shared/utils');

/**
 * @func configFactory
 * @desc
 * ```js
 * const configFactory = require('@dr.pogodin/react-utils/config/webpack/lib-base');
 * ```
 * Creates a new Webpack config object.
 * @param {object} ops Configuration params. This allows to conveniently set
 * options that should be customized for specific libraries.
 * @param {string} ops.babelEnv Babel environment to use for Babel compilation
 * step;
 * @param {object} [ops.babelLoaderOptions] Overrides for default Babel options
 * of JSX and SVG files loader.
 * @param {string} ops.context Base URL for resolution of relative config paths.
 * @param {string} [ops.cssLocalIdent=hash:base64:6] The template for CSS
 * classnames generation by the Webpack's css-loader; it is passed into
 * the localIdentName param of the loader. It should match the corresponding
 * setting in the Babel config.
 * @param {string|string[]} ops.entry Entry point(s). The config may prepend
 * them by necessary polyfills.
 * @param {string} ops.library Name of the library to be build. It is important
 * for proper resolution of the library assets.
 * @param {string} [ops.outputPath=build] Output path.
 * @param {string} [ops.mode] [Webpack mode](https://webpack.js.org/concepts/mode/).
 * @return {Object}
 * - The generated config will opt to:
 *   - References to the font assets (EOF, OTF, SVG, TTF, WOFF, WOFF2 files from
 *     the `src/assets/fonts` folder of the library source code) will rewritten
 *     to `~LIBRARY_NAME/src/assets/fonts/FILENAME.FILE_EXTENSION`
 *     so that the host package of the library will be able to find and bundle
 *     them;
 * - Bundle SCSS files from any folder of your source code, beside
 *  `node_modules` and its subfolders. The files will be compiled,
 *   bundled and extracted into the `build/{type}/style.css`
 *   bundles;
 * - Bundle JS, JSX, and SVG files; they will be compiled into the
 *   `build/{type}/web.bundle.js` bundles, using the Babel environment
 *    specified in the factory options, and
 *    [`config/babel/webpack`](./babel-config.js#webpack) config.
 *
 * - The following path aliases will be automatically set:
 *   - **`assets`** for `[CONTEXT]/src/assets`;
 *   - **`components`** for `[CONTEXT]/src/shared/components`;
 *   - **`fonts`** for `[CONTEXT]/src/assets/fonts`;
 *   - **`styles`** for `[CONTEXT]/src/styles`.
 *
 * Also `resolve.symlinks` Webpack option is set to *false* to avoid problems
 * with resolution of assets from packages linked with `npm link`.
 *
 * - The following packages are declared as externals:
 *   - `@babel/runtime`
 *   - `@dr.pogodin/react-global-state`
 *   - `@dr.pogodin/react-themes`
 *   - `@dr.pogodin/react-utils`
 *   - `axios`
 *   - `dayjs`
 *   - `lodash`
 *   - `prop-types`
 *   - `react`
 *   - `react-dom`
 *   - `react-helmet`
 *   - `react-router-dom`
 *   - `shortid`
 *   - `url-parse`
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
      'react-router-dom',
      'uuid',
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
        type: 'asset/resource',
        generator: {
          // TODO: This comes from the older config version which relied on
          // file-loader. It might require some correction to correctly join
          // `publicPath` and `filename`.
          filename: '../shared/[path][name][ext]',
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
          presets: [
            // NOTE: For the compilation of this very library (react-utils),
            // this plugin path is overriden in webpack.config.js in the root of
            // the codebase.
            ['@dr.pogodin/react-utils/config/babel/webpack', {
              noRR: true,
            }],
          ],
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
                getLocalIdent,
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
