/* eslint-disable import/no-extraneous-dependencies */

const { pick, pull } = require('lodash');
const getWebpackBabelConfig = require('./webpack');

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
  const baseOps = pick(options, ['noStyling']);
  const config = getWebpackBabelConfig(
    babel,
    { ...baseOps, targets: 'current node' },
  );

  const baseAssetsOutputPath = options.baseAssetsOutputPath || '';
  config.plugins.push(
    ['@dr.pogodin/transform-assets', {
      extensions: ['gif', 'jpeg', 'jpg', 'png'],
      name: `${baseAssetsOutputPath}/images/[hash:20].[ext]`,
    }],
  );

  const moduleResolverPluginOps = config.plugins.find(
    (x) => x[0] === 'module-resolver',
  )[1];
  moduleResolverPluginOps.transformFunctions = [
    'requireWeak',
    'resolveWeak',
    'webpack.requireWeak',
    'webpack.resolveWeak',
  ];

  if (babel.env() === getWebpackBabelConfig.ENVIRONMENTS.DEV) {
    pull(config.plugins, 'react-refresh/babel');
  }

  return config;
}

/**
 * Updates given `config` with styling ((S)CSS-related) setup.
 *
 * **Beware:** It mutates `config`.
 *
 * @param {object} config
 * @return {object} Returns mutated config for chaining.
 * @ignore
 */
function addStyling(config) {
  const cssModulesOps = config.plugins.find(
    ([name]) => name === '@dr.pogodin/react-css-modules',
  )[1];
  cssModulesOps.replaceImport = true;
  return config;
}

/**
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
