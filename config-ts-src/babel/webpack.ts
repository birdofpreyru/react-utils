import { pick } from 'lodash';

import {
  type PluginOptionsT as ReactCssModulesOptionsT,
} from '@dr.pogodin/babel-plugin-react-css-modules';

const {
  generateScopedNameFactory,
} = require('@dr.pogodin/babel-plugin-react-css-modules/utils');

const generateScopedNameDev = generateScopedNameFactory(
  '[package]___[path][name]___[local]___[hash:base64:6]',
);

const generateScopedNameProd = generateScopedNameFactory(
  '[hash:base64:6]',
);

export interface BabelCompilerI {
  env: () => string;
}

export type OptionsT = {
  noRR?: boolean;
  noStyling?: boolean;
  targets?: string | string[] | { [key: string]: string };
};

/**
 * Supported Babel environments.
 */
export enum ENVIRONMENTS {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

export interface PresetOrPluginOptionsI {}

type PresetOrPluginT = string | [string, PresetOrPluginOptionsI];

export type ConfigT = {
  presets: PresetOrPluginT[];
  plugins: PresetOrPluginT[];
};

/**
 * Creates a new base config.
 * @param [options] Base config options.
 * @return Generated config.
 */
function newBaseConfig(options: OptionsT = {}): ConfigT {
  return {
    presets: [
      // Chrome 69 is the browser for Android API 28.
      ['@babel/env', { targets: options.targets || 'defaults or chrome >= 69' }],

      // TODO: Starting from Babel 8, "automatic" will be the default runtime,
      // thus once upgraded to Babel 8, runtime should be removed from
      // @babel/react options below.
      ['@babel/react', { runtime: 'automatic' }],

      '@dr.pogodin/babel-preset-svgr',

      // TODO: Should we rather optionally include it for TS projects only?
      '@babel/typescript',
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
function addStyling(config: ConfigT, env: ENVIRONMENTS) {
  const cssModulesOps: ReactCssModulesOptionsT = {
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
 * @param babel Babel compiler.
 * @param [ops] Preset options.
 * @param [ops.noRR] If truthy `react-refresh/babel` plugin is not
 *  included into config, no matter the environment.
 * @param [ops.noStyling] If truthy all setup related to styling
 *  ((S)CSS processing) will be skipped.
 * @param [ops.targets=defaults] Targets for
 *  `@babel/preset-env`.
 * @return Generated config.
 */
export default function getPreset(babel: BabelCompilerI, ops: OptionsT = {}) {
  const env = babel.env();

  const baseOps = pick(ops, ['targets']);
  const res = newBaseConfig(baseOps);

  if (!ops.noStyling) addStyling(res, env as ENVIRONMENTS);
  if (env === ENVIRONMENTS.DEV && !ops.noRR) {
    res.plugins.push('react-refresh/babel');
  }
  return res;
}
