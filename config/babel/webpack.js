/**
 * [Babel](https://babeljs.io/) preset for Webpack builds.
 *
 * To include it into a Babel configuration:
 * ```json
 * {
 *   "presets": ["@dr.pogodin/react-utils/config/babel/webpack"]
 * }
 * ```
 *
 * To provide additional options (for supported options see documentation for
 * _ops_ argument of {@link module:babel/webpack.getPreset getPreset()} method
 * below):
 * ```json
 * {
 *   "presets": [
 *     ["@dr.pogodin/react-utils/config/babel/webpack", {
 *       "someOption": "someValue"
 *     }]
 *   ]
 * }
 * ```
 *
 * This preset does the following:
 *
 * - Sets up [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env),
 *   and [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)
 *   presets which are needed to compile modern JS(X) code.
 *
 * - Sets up [@dr.pogodin/babel-preset-svgr](https://www.npmjs.com/package/@dr.pogodin/babel-preset-svgr)
 *   preset, which allows to import SVG files as React components.
 *
 * - Sets up [babel-plugin-module-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver),
 *   which helps to resolve module imports relative to `/src/shared`,
 *   and `/src` folders of host codebase.
 *
 * - Sets up [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime),
 *   which enables the re-use of Babel's injected helper code to save on
 *   codesize.
 *
 * - Sets up [@dr.pogodin/babel-plugin-react-css-modules](https://www.npmjs.com/package/@dr.pogodin/babel-plugin-react-css-modules),
 *   which is a part of CSS modules setup that transforms `styleName` props of
 *   React components into globally unique `className` props. Generated class
 *   names are verbose in _development_ and _test_ environments, to faciliate
 *   debugging, and they are short 6-symbol-long hashes in _production_ Babel
 *   environment, to ensure compact CSS and JS output code.
 *
 * - In _development_ environment it also sets up `react-refresh/babel`.
 */

const _ = require('lodash');

const {
  generateScopedNameDev,
  generateScopedNameProd,
} = require('../shared/utils');

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
      ['@babel/env', { targets: options.targets || 'defaults' }],

      // TODO: Starting from Babel 8, "automatic" will be the default runtime,
      // thus once upgraded to Babel 8, runtime should be removed from
      // @babel/react options below.
      ['@babel/react', { runtime: 'automatic' }],

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

  const baseOps = _.pick(ops, ['targets']);
  const res = newBaseConfig(baseOps);

  if (!ops.noStyling) addStyling(res, env);
  if (env === ENVIRONMENTS.DEV && !ops.noRR) {
    res.plugins.push('react-refresh/babel');
  }
  return res;
}

module.exports = getPreset;
module.exports.ENVIRONMENTS = ENVIRONMENTS;
