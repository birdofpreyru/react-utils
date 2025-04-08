// Base Webpack config for ReactJS libraries.

/* eslint-disable import/no-extraneous-dependencies */

import path from 'path';

import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import {
  type Configuration,
  type WebpackPluginInstance,
  ProgressPlugin,
} from 'webpack';

import {
  getLocalIdent,
} from '@dr.pogodin/babel-plugin-react-css-modules/utils';

export type OptionsT = {
  babelEnv: string;
  babelLoaderOptions?: object;
  context: string;
  cssExtractionOptions?: MiniCssExtractPlugin.PluginOptions;
  cssLocalIdent?: string;
  dontUseProgressPlugin?: boolean;
  entry: string | string[];
  library: string;
  mode: 'development' | 'none' | 'production';
  outputPath?: string;
  typescript?: boolean;
};

/**
 * @param {object} ops
 * @param {boolean} [ops.dontUseProgressPlugin] Set to not include progress
 *  plugin.
 * @return {object}
 */
export default function configFactory(ops: OptionsT): Configuration {
  const plugins: WebpackPluginInstance[] = [
    new MiniCssExtractPlugin({
      filename: 'style.css',
      ...ops.cssExtractionOptions,
    }),
  ];

  if (!ops.dontUseProgressPlugin) plugins.push(new ProgressPlugin());

  return {
    context: ops.context,
    entry: ops.entry,
    externals: [
      /@babel\/runtime/,
      '@dr.pogodin/js-utils',
      '@dr.pogodin/react-global-state',
      '@dr.pogodin/react-helmet',
      '@dr.pogodin/react-themes',
      '@dr.pogodin/react-utils',
      'axios',
      'cookie',
      'dayjs',
      'lodash',
      /node-forge/,
      'qs',
      'react',
      /react-dom/,
      'react-router',
      'uuid',
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
    plugins,
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
          publicPath: `${ops.library}/build/shared`,
        },
      }, {
        // Aggregates source maps from dependencies.
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      }, {
        /* Loads JS and JSX moudles, and inlines SVG assets. */
        test: ops.typescript ? /\.((j|t)sx?|svg)$/ : /\.(jsx?|svg)$/,
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
              typescript: ops.typescript,
            }],
          ],
          ...ops.babelLoaderOptions ?? {},
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

                // This flag defaults `true` for ES module builds since css-loader@7.0.0:
                // https://github.com/webpack-contrib/css-loader/releases/tag/v7.0.0
                // We'll keep it `false` to avoid a breaking change for dependant
                // projects, and I am also not sure what are the benefits of
                // named CSS exports anyway.
                namedExport: false,
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
      extensions: [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
        '.scss',
      ],
      symlinks: false,
    },
  };
}
