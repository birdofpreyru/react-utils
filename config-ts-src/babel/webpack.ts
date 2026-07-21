import type { InputOptions, PluginItem, PresetItem } from '@babel/core';

import type {
  OptionsT as AddImportExtensionOptions,
} from '@dr.pogodin/babel-plugin-add-import-extension';

import type {
  PluginOptionsT as ReactCssModulesOptionsT,
} from '@dr.pogodin/babel-plugin-react-css-modules';

import {
  generateScopedNameFactory,
} from '@dr.pogodin/babel-plugin-react-css-modules/utils';

const generateScopedNameDev = generateScopedNameFactory(
  '[package]___[path][name]___[local]___[hash:base64:6]',
);

const generateScopedNameProd = generateScopedNameFactory(
  '[hash:base64:6]',
);

export type ConfigurationT = InputOptions & {
  plugins: PluginItem[];
  presets: PresetItem[];
};

// TODO: Check it.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface BabelCompilerI {
  env: () => string;
}

/**
 * Supported Babel environments.
 */
export enum ENVIRONMENTS {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

// Valid values for `module` option of @babel/preset-env,
// as per https://babeljs.io/docs/babel-preset-env#modules
type ModuleT = 'amd' | 'auto' | 'cjs' | 'commonjs' | 'systemjs' | 'umd' | false;

export type OptionsT = {
  addImportExtensions?: AddImportExtensionOptions | boolean;
  modules?: ModuleT;
  noRR?: boolean;
  noReactCompiler?: boolean;
  noStyling?: boolean;

  // Set `true` to add into config pieces necessary for TypeScript processing.
  typescript?: boolean;
};

/**
 * Creates a new base config.
 * @param [options] Base config options.
 * @return Generated config.
 */
function newBaseConfig(options: OptionsT): ConfigurationT {
  const plugins: PluginItem[] = [];

  if (!options.noReactCompiler) plugins.push('babel-plugin-react-compiler');

  plugins.push(
    ['module-resolver', {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      root: ['./src/shared', './src'],
    }],
    '@babel/transform-runtime',
    ['polyfill-corejs3', { method: 'usage-pure', version: '3.49' }],
  );

  if (options.addImportExtensions) {
    plugins.push(
      ['@dr.pogodin/add-import-extension',
        typeof options.addImportExtensions === 'object'
          ? options.addImportExtensions
          : {
            replacements: { svg: 'svg.js' },
          }],
    );
  }

  return {
    parserOpts: {
      // TODO: This is a temporary workaround for babel-plugin-module-resolver
      // not supporting Babel v8; see:
      // https://github.com/tleunen/babel-plugin-module-resolver/issues/452,
      // https://babeljs.io/docs/v8-migration-api#javascript-nodes.
      createImportExpressions: false,
    },
    plugins,
    presets: [
      ['@babel/env', {
        // Leaves it to the Webpack to deal with modules.
        modules: options.modules ?? false,
      }],
      '@babel/react',
      '@dr.pogodin/babel-preset-svgr',
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
function addStyling(config: ConfigurationT, env: ENVIRONMENTS) {
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
 * @return Generated config.
 */
export default function getPreset(
  babel: BabelCompilerI,
  ops: OptionsT = {},
): ConfigurationT {
  const env = babel.env();

  const res = newBaseConfig(ops);

  if (!ops.noStyling) addStyling(res, env as ENVIRONMENTS);
  if (env === (ENVIRONMENTS.DEV as string) && !ops.noRR) {
    res.plugins.push('react-refresh/babel');
  }

  // Conditional to not require non-TypeScript projects to install TypeScript-
  // specific dependencies for build process.
  if (ops.typescript) {
    res.presets.push(
      ['@babel/typescript', {
        // This ensures TypeScript compilation does not remove "unused" imports,
        // as in most cases it considers assets (e.g. stylesheet) imports as
        // unused, while other steps of our build process rely on them
        // (e.g. @dr.pogodin/react-css-modules plugin).
        onlyRemoveTypeImports: true,
      }],
    );
  }

  return res;
}
