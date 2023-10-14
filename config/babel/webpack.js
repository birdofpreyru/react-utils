const { pick } = require('lodash');

const {
  generateScopedNameFactory,
} = require('@dr.pogodin/babel-plugin-react-css-modules/utils');

const generateScopedNameDev = generateScopedNameFactory(
  '[package]___[path][name]___[local]___[hash:base64:6]',
);

const generateScopedNameProd = generateScopedNameFactory(
  '[hash:base64:6]',
);

/**
 * @static
 * @desc
 * ```js
 * import { ENVIRONMENTS } from '@dr.pogodin/react-utils/config/babel/webpack';
 * ```
 * Supported Babel environments.
 * @prop {string} DEV `development`
 * @prop {string} PROD `production`
 * @prop {string} TEST `test`
 */
const ENVIRONMENTS = {
  DEV: 'development',
  PROD: 'production',
  TEST: 'test',
};

/**
 * Creates a new base config.
 * @param {object} [options] Base config options.
 * @param {string|string[]|object} [options.targets=defaults]
 *  `@babel/preset-env` targets.
 * @return {object} Generated config.
 * @ignore
 */
function newBaseConfig(options = {}) {
  return {
    presets: [
      // Chrome 69 is the browser for Android API 28.
      ['@babel/env', { targets: options.targets || 'defaults or chrome >= 69' }],

      // TODO: Starting from Babel 8, "automatic" will be the default runtime,
      // thus once upgraded to Babel 8, runtime should be removed from
      // @babel/react options below.
      ['@babel/react', { runtime: 'automatic' }],

      '@dr.pogodin/babel-preset-svgr',
    ],
    plugins: [
      ['module-resolver', {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        root: [
          './src/shared',
          './src',
        ],
      }],
      '@babel/transform-runtime',
    ],
  };
}

/**
 * Updates given `config` with styling ((S)CSS-related) setup.
 *
 * **Beware:** It mutates `config`.
 *
 * @param {object} config
 * @param {string} env Target environment: `development` or `production`.
 * @return {object} Returns mutated config for chaining.
 * @ignore
 */
function addStyling(config, env) {
  const cssModulesOps = {
    autoResolveMultipleImports: true,
    filetypes: {
      '.scss': { syntax: 'postcss-scss' },
    },
  };
  config.plugins.push(['@dr.pogodin/react-css-modules', cssModulesOps]);
  switch (env) {
    case ENVIRONMENTS.DEV:
    case ENVIRONMENTS.TEST:
      cssModulesOps.generateScopedName = generateScopedNameDev;
      break;
    case ENVIRONMENTS.PROD:
      cssModulesOps.generateScopedName = generateScopedNameProd;
      break;
    default:
  }
  return config;
}

/**
 * Generates Babel preset for Webpack.
 * @param {object} babel Babel compiler.
 * @param {object} [ops] Preset options.
 * @param {boolean} [ops.noRR] If truthy `react-refresh/babel` plugin is not
 *  included into config, no matter the environment.
 * @param {boolean} [ops.noStyling] If truthy all setup related to styling
 *  ((S)CSS processing) will be skipped.
 * @param {string|string[]|object} [ops.targets=defaults] Targets for
 *  `@babel/preset-env`.
 * @return {object} Generated config.
 */
function getPreset(babel, ops = {}) {
  const env = babel.env();

  const baseOps = pick(ops, ['targets']);
  const res = newBaseConfig(baseOps);

  if (!ops.noStyling) addStyling(res, env);
  if (env === ENVIRONMENTS.DEV && !ops.noRR) {
    res.plugins.push('react-refresh/babel');
  }
  return res;
}

module.exports = getPreset;
module.exports.ENVIRONMENTS = ENVIRONMENTS;
