/**
 * Base Webpack configuration for ReactJS applications. It is further extended
 * for development and production use in the "app-development" and
 * "app-production" configs.
 */

const _ = require('lodash');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const forge = require('node-forge');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const SM = require('sitemap');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');

/**
 * Creates a new Webpack config object, and performs some auxiliary operations
 * on the way.
 *
 * @param {Object} ops Configuration params. This allows to modify some
 *  frequently changed options in a convenient way, without a need to manipulate
 *  directly with the created config object.
 *
 *  The following options are accepted:
 *
 * @param {String} ops.babelEnv BABEL_ENV to use for Babel during the build.
 *
 * @param {String} ops.context Base URL for resolution of relative
 *  config paths.
 *
 * @param {String} ops.cssLocalIdent Optional. The template for CSS classnames
 *  generation by css-loader (it will be passed into the "localIdentName" param
 *  of the loader). It should match the corresponding setting in the Babel
 *  config. Defaults to: [hash:base64:6].
 *
 * @param {boolean} [ops.dontEmitBuildInfo] Set to prevent creation of
 *  .build-info file.
 *
 * @param {Object|String|String[]} ops.entry Entry points. If an object is
 *  passed in, the "polyfills" entry point is extended or appended to
 *  include some polyfills we consider obligatory. If a string or an array is
 *  passed in, it is assigned to the "main" entry point, and the "polyfills"
 *  entry point will be added to it.
 *
 * @param {Boolean|Object} ops.workbox Adds InjectManifest plugin from Workbox,
 *  with given options, if the argument is Object, or default ones, if it is any
 *  other truly value.
 *
 * @param {Boolean} ops.keepBuildInfo Optional. If `true` and a build info file
 *  from a previous build is found, the factory will use that rather than
 *  re-generating it. This provide the way to re-create webpack config at the
 *  server startup, without re-writing the build info generated previously
 *  during the bundling. Defaults to `false`.
 *
 * @param {String} [ops.outputPath] Optional. Output path for the build.
 *  Defaults to `build` folder inside the `context` path.
 *
 * @param {boolean} [ops.dontTimestampOutputs] Optional. If set `true` ouput
 *  CSS and JS files will not have build timestamp appended to their names.
 *
 * @param {String} ops.publicPath Base URL for the output of the build assets.
 *
 * @param {String} [ops.sitemap] Optional. A path to JS module or JSON file,
 *  which retuns a sitemap config or factory. If set, the sitemap will be build
 *  and served.
 */
module.exports = function configFactory(ops) {
  const o = _.defaults(_.clone(ops), {
    cssLocalIdent: '[hash:base64:6]',
    outputPath: 'build/web-public',
    publicPath: '',
  });

  /* TODO: This works in practice, but being async and not awaited it is a bad
   * pattern. */
  if (o.sitemap) {
    const sitemapUrl = path.resolve(o.context, o.sitemap);
    /* eslint-disable global-require, import/no-dynamic-require */
    let source = require(sitemapUrl);
    if (_.isFunction(source)) source = source();
    /* eslint-enable global-require, import/no-dynamic-require */
    const sm = new SM.SitemapStream();
    source.forEach((item) => sm.write(item));
    sm.end();
    SM.streamToPromise(sm).then((sitemap) => {
      const outUrl = path.resolve(o.context, o.outputPath);
      if (!fs.existsSync(outUrl)) fs.mkdirSync(outUrl);
      fs.writeFileSync(
        path.resolve(o.context, o.outputPath, 'sitemap.xml'),
        sitemap,
      );
    });
  }

  const now = moment();

  let outputFilenameSuffix = '';
  if (!o.dontTimestampOutputs) {
    outputFilenameSuffix = `-${now.valueOf()}`;
  }

  let buildInfo;
  const buildInfoUrl = path.resolve(o.context, '.build-info');
  /* If build-info file is found, we reuse those data. */
  if (!o.dontEmitBuildInfo) {
    if (fs.existsSync(buildInfoUrl) && o.keepBuildInfo) {
      buildInfo = JSON.parse(fs.readFileSync(buildInfoUrl));
    } else {
      /* Stores misc build info into the local ".build-info" file in the context
      * directory. */
      buildInfo = {
        /* A random 32-bit key, that can be used for encryption. */
        key: forge.random.getBytesSync(32),

        /* Public path used during build. */
        publicPath: o.publicPath,

        /* Build timestamp. */
        timestamp: now.utc().toISOString(),

        /* `true` if client-side code should setup a service worker. */
        useServiceWorker: Boolean(o.workbox),
      };
      fs.writeFileSync(buildInfoUrl, JSON.stringify(buildInfo));
    }
  }

  /* Entry points normalization. */
  const entry = _.isPlainObject(o.entry)
    ? _.cloneDeep(o.entry) : { main: o.entry };
  if (!entry.polyfills) entry.polyfills = [];
  else if (!_.isArray(entry.polyfills)) {
    entry.polyfills = [entry.polyfills];
  }

  entry.polyfills = _.union(entry.polyfills, [
    'core-js/stable',
    'regenerator-runtime/runtime',
    'nodelist-foreach-polyfill',
  ]);

  const plugins = [
    new MiniCssExtractPlugin({
      chunkFilename: `[name]${outputFilenameSuffix}.css`,
      filename: `[name]${outputFilenameSuffix}.css`,
    }),
    new webpack.DefinePlugin({
      BUILD_INFO: JSON.stringify(buildInfo),
    }),
    new StatsWriterPlugin({
      filename: '__stats__.json',
    }),
  ];

  /* Adds InjectManifest plugin from WorkBox, if opted to. */
  if (o.workbox) {
    if (!_.isObject(o.workbox)) o.workbox = {};
    plugins.push(new WorkboxPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, '../workbox/default.js'),
      ...o.workbox,
      swDest: '__service-worker.js',
    }));
  }

  return {
    context: o.context,
    entry,
    node: {
      __dirname: true,
      fs: 'empty',
    },
    mode: o.mode,
    output: {
      chunkFilename: `[name]${outputFilenameSuffix}.js`,
      filename: `[name]${outputFilenameSuffix}.js`,
      path: path.resolve(__dirname, o.context, o.outputPath),
      publicPath: `${o.publicPath}/`,
    },
    plugins,
    resolve: {
      alias: {
        /* Aliases to JS an JSX files are handled by Babel. */
        assets: path.resolve(o.context, 'src/assets'),
        components: path.resolve(o.context, 'src/shared/components'),
        fonts: path.resolve(o.context, 'src/assets/fonts'),
        styles: path.resolve(o.context, 'src/styles'),
      },
      extensions: ['.js', '.json', '.jsx', '.scss'],
      symlinks: false,
    },
    module: {
      rules: [{
        /* Loads font resources from "src/assets/fonts" folder. */
        test: /\.(eot|otf|svg|ttf|woff2?)$/,
        include: [
          /node_modules/,
          /src[/\\]assets[/\\]fonts/,
        ],
        loader: 'file-loader',
        options: {
          outputPath: 'fonts/',
          publicPath: `${o.publicPath}/fonts`,
          name: '[md5:hash].[ext]',
        },
      }, {
        /* Loads JS and JSX moudles, and inlines SVG assets. */
        test: /\.(jsx?|svg)$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          envName: o.babelEnv,
          presets: ['@dr.pogodin/react-utils/config/babel/webpack'],
        },
      }, {
        /* Loads image assets. */
        test: /\.(gif|jpe?g|png)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'images/',
          publicPath: `${o.publicPath}/images`,
          name: '[md5:hash].[ext]',
        },
      }, {
        /* Loads SCSS stylesheets. */
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: o.cssLocalIdent,
              },
            },
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer],
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
    optimization: {
      /* TODO: Dynamic chunk splitting does not play along with server-side
       * rendering of split chunks. Probably there is a way to achieve that,
       * but it is not a priority now. */
      splitChunks: false,
    },
  };
};
