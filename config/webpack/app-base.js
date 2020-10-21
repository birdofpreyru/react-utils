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
const path = require('path');
const SM = require('sitemap');
const { DefinePlugin, ProgressPlugin } = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');

const { getLocalIdent } = require('../shared/utils');

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
 * @param {object} [ops.babelLoaderOptions] Optional. Overrides for babel-loader
 *  of JSX and SVG files.
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
 * @param {String} ops.publicPath Base URL for the output of the build assets.
 *
 * @param {String} [ops.sitemap] Optional. A path to JS module or JSON file,
 *  which retuns a sitemap config or factory. If set, the sitemap will be build
 *  and served.
 */
module.exports = function configFactory(ops) {
  const o = _.defaults(_.clone(ops), {
    babelLoaderOptions: {},
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

  // TODO: Once all assets are named by hashes, we probably don't need build
  // info anymore beside the key, which can be merged into stats object?
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
    new DefinePlugin({
      BUILD_INFO: JSON.stringify(buildInfo),
    }),
    new ProgressPlugin(),
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
    },
    mode: o.mode,
    output: {
      chunkFilename: '[contenthash].js',
      filename: '[contenthash].js',
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
      fallback: {
        // TODO: Added for older normalize-url versions to work with Webpack@5.
        // normalize-url is our indirect dependency, used by a couple of Webpack
        // community loaders / plugins, thus presumably we can drop this setting
        // later, along with "url" library dependency.
        url: require.resolve('url'),
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
          name: '[contenthash].[ext]',
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
          ...o.babelLoaderOptions,
        },
      }, {
        /* Loads image assets. */
        test: /\.(gif|jpe?g|png)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'images/',
          publicPath: `${o.publicPath}/images`,
          name: '[contenthash].[ext]',
        },
      }, {
        /* Loads SCSS stylesheets. */
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              modules: {
                getLocalIdent,
                localIdentName: o.cssLocalIdent,
              },
            },
          }, {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
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
  };
};
