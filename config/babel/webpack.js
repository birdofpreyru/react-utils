/* Babel preset for the Webpack build. */

const _ = require('lodash');

/**
 * Supported Babel environments.
 */
const ENVIRONMENTS = {
  DEV: 'development',
  PROD: 'production',
  TEST: 'test',
};

/**
 * Creates a new base config.
 * @param {object} [options] Optional Base config options.
 * @param {string|string[]|object} [options.targets] Optional. Babel/env preset
 *  targets.
 * @return {object} Configuration.
 */
function newBaseConfig(options = {}) {
  return {
    presets: [
      ['@babel/env', { targets: options.targets || 'defaults' }],
      '@babel/react',
      '@dr.pogodin/babel-preset-svgr',
    ],
    plugins: [
      ['module-resolver', {
        extensions: ['.js', '.jsx'],
        root: [
          './src/shared',
          './src',
        ],
      }],
      '@babel/syntax-dynamic-import',
      '@babel/transform-runtime',
    ],
  };
}

/**
 * Adds styling components to the provided config.
 * Beware: It mutates `config`.
 * @param {object} config
 * @param {string} env Target environment: "development" or "production".
 * @return {object} Returns mutated config for chaining.
 */
function addStyling(config, env) {
  const cssModulesOps = {
    filetypes: {
      '.scss': { syntax: 'postcss-scss' },
    },
  };
  config.plugins.push(['react-css-modules', cssModulesOps]);
  switch (env) {
    case ENVIRONMENTS.DEV:
    case ENVIRONMENTS.TEST:
      cssModulesOps.generateScopedName = '[path][name]___[local]___[hash:base64:6]';
      break;
    case ENVIRONMENTS.PROD:
      cssModulesOps.generateScopedName = '[hash:base64:6]';
      break;
    default:
  }
  return config;
}

/**
 * Generates Webpack Babel preset.
 * @param {object} babel Babel compiler.
 * @param {object} [ops] Optional. Preset options.
 * @param {boolean} [ops.noStyling] Optional. If set, the preset won't include
 *  any components for (S)CSS processing.
 * @param {string|string[]|object} [ops.targets] Optional. Targets setting for
 *  the "babel/env" preset.
 */
function getPreset(babel, ops = {}) {
  const env = babel.env();

  const baseOps = _.pick(ops, ['targets']);
  const res = newBaseConfig(baseOps);

  if (!ops.noStyling) addStyling(res, env);
  if (env === ENVIRONMENTS.DEV) res.plugins.push('react-hot-loader/babel');
  return res;
}

module.exports = getPreset;
module.exports.ENVIRONMENTS = ENVIRONMENTS;
