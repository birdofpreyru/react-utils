/**
 * @category Configs
 * @module babel/node-ssr
 * @desc [Babel](https://babeljs.io/) preset for NodeJS builds & server-side
 * execution.
 *
 * To include it into a Babel configuration:
 * ```json
 * {
 *   "presets": ["@dr.pogodin/react-utils/config/babel/node-ssr"]
 * }
 * ```
 *
 * To provide additional preset options (for supported options see
 * documentation for _ops_ argument of
 * {@link module:babel/node.getConfig getConfig()} method below):
 * ```json
 * {
 *   "presets": [
 *     ["@dr.pogodin/react-utils/config/babel/node-ssr", {
 *       "someOption": "someValue"
 *     }]
 *   ]
 * }
 * ```
 *
 * This preset builds on top of {@link module:babel/webpack babel/webpack}
 * preset: it performs all the same setups, then on top of it does
 * the following:
 *
 * - Sets up [babel-plugin-css-modules-transform](https://www.npmjs.com/package/babel-plugin-css-modules-transform),
 *   which transforms (S)CSS imports into JS objects mapping original (S)CSS
 *   class names into transformed class names emitted into CSS bundle (thus,
 *   matching (S)CSS transformations done by
 *   `@dr.pogodin/babel-plugin-react-css-modules` plugin on (S)CSS code.
 *
 * - Sets up [@babel/plugin-syntax-dynamic-import](https://www.npmjs.com/package/@babel/plugin-syntax-dynamic-import)
 *   to allow for dynamic `import()` statements.
 *
 * - Sets up [babel-plugin-tranform-assets](https://www.npmjs.com/package/@dr.pogodin/babel-plugin-transform-assets)
 *   to convert GIF, JPEG, JPG, and PNG imports into emitted asset paths, like
 *   `/images/[FILE_HASH].[FILE_EXTENSION]`. The `baseAssetsOutputPath` preset
 *   option allows to add custom prefix to these paths.
 *
 * - In _development_ environment it removes
 *   [react-hot-loader/babel](https://www.npmjs.com/package/react-hot-loader),
 *   plugin setup by the underlying config for webpack.
 */
/* eslint-disable import/no-extraneous-dependencies */

const _ = require('lodash');
const postcssScss = require('postcss-scss');
const getWebpackBabelConfig = require('./webpack');

const {
  generateScopedNameDev,
  generateScopedNameProd,
} = require('../shared/utils');

/**
 * Creates a new base config.
 * @param {object} babel Babel compiler.
 * @param {object} [options] It supports all options of
 *  {@link module:babel/webpack.getPreset babel/webpack's getPreset()},
 *  but it overrides `targets` option with `current node` value, and further
 *  accepts the following:
 * @param {string} [options.baseAssetsOutputPath] Path prefix for emitted
 *  image assets.
 * @return {object} Created config object.
 * @ignore
 */
function newBase(babel, options = {}) {
  const baseOps = _.pick(options, ['noStyling']);
  const config = getWebpackBabelConfig(
    babel,
    { ...baseOps, targets: 'current node' },
  );

  const baseAssetsOutputPath = options.baseAssetsOutputPath || '';
  config.plugins.push(
    '@babel/syntax-dynamic-import',
    ['@dr.pogodin/transform-assets', {
      extensions: ['gif', 'jpeg', 'jpg', 'png'],
      name: `${baseAssetsOutputPath}/images/[hash].[ext]`,
    }],
  );

  const moduleResolverPluginOps = config.plugins.find(
    (x) => x[0] === 'module-resolver',
  )[1];
  moduleResolverPluginOps.transformFunctions = [
    'resolveWeak',
    'webpack.resolveWeak',
  ];

  if (babel.env() === getWebpackBabelConfig.ENVIRONMENTS.DEV) {
    _.pull(config.plugins, 'react-hot-loader/babel');
  }

  return config;
}

/**
 * Updates given `config` with styling ((S)CSS-related) setup.
 *
 * **Beware:** It mutates `config`.
 *
 * @param {object} config
 * @param {string} env `development` or `production`.
 * @return {object} Returns mutated config for chaining.
 * @ignore
 */
function addStyling(config, env) {
  const cssModulesTransformOps = {
    extensions: ['.css', '.scss'],
    processorOpts: { parser: postcssScss },
  };
  switch (env) {
    case getWebpackBabelConfig.ENVIRONMENTS.DEV:
    case getWebpackBabelConfig.ENVIRONMENTS.TEST:
      cssModulesTransformOps.generateScopedName = generateScopedNameDev;
      break;
    case getWebpackBabelConfig.ENVIRONMENTS.PROD:
      cssModulesTransformOps.generateScopedName = generateScopedNameProd;
      break;
    default:
  }
  config.plugins.push([
    '@dr.pogodin/css-modules-transform',
    cssModulesTransformOps,
  ]);
  return config;
}

/**
 * @static
 * @desc
 * ```js
 * import getConfig from '@dr.pogodin/react-utils/config/babel/node-ssr';
 * ```
 * Generates Babel config for NodeJS compilation and server-side  execution.
 * @param {object} babel Babel compiler instance.
 * @param {object} [ops] Preset options. It supports all options accepted by
 *  the underlying {@link module:babel/webpack preset for Webpack}, but it
 *  overrides `targets` option by `current node` value, and also accepts
 *  the following additional options:
 * @param {string} [ops.baseAssetsOutputPath] Path prefix for emitted image
 *  assets.
 * @return {object} Generated config.
 */
function getConfig(babel, ops = {}) {
  const env = babel.env();
  const config = newBase(babel, ops);
  if (!ops.noStyling) addStyling(config, env);
  return config;
}

module.exports = getConfig;
