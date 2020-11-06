/* Babel preset for NodeJS build with support of server-side JSX rendering. */
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
 * @param {object} [options] Optional. Options.
 * @return {object} Config.
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
 * Mutates `config` to support styling ((S)CSS) processing.
 * @param {object} config
 * @param {string} env "development" or "production".
 * @return {object} Returns mutated config for chaining.
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

function getConfig(babel, ops = {}) {
  const env = babel.env();
  const config = newBase(babel, ops);
  if (!ops.noStyling) addStyling(config, env);
  return config;
}

module.exports = getConfig;
