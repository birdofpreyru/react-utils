import { pull } from 'lodash-es';

import type { PluginOptions, PluginTarget, TransformOptions } from '@babel/core';

import type {
  PluginOptionsT as ReactCssModulesOptionsT,
} from '@dr.pogodin/babel-plugin-react-css-modules';

import getWebpackBabelConfig, {
  type BabelCompilerI,
  type OptionsT as WebpackConfigOptionsT,
  ENVIRONMENTS,
} from './webpack';

// TODO: Double-check why .transformFunction is not present in TransformOptions?
// should we do some correction of the typing?
//
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ModuleResolverOptionsI extends TransformOptions {
  transformFunctions?: string[];
}

type OptionsT = WebpackConfigOptionsT & {
  baseAssetsOutputPath?: string;
};

/**
 * Creates a new base config.
 * @param babel Babel compiler.
 * @param [options] It supports all options of our Babel config for Webpack,
 *  but it overrides `targets` option with "current node" value, and further
 *  accepts the following:
 * @param [options.baseAssetsOutputPath] Path prefix for emitted
 *  image assets.
 * @return Created config object.
 */
function newBase(babel: BabelCompilerI, options: OptionsT = {}) {
  const config = getWebpackBabelConfig(
    babel,
    {
      // NOTE: It make sense to have "modules": false here,
      // but it needs a bunch of build configuration updates,
      // and ends-up with conflict of Jest with ES modules (as now
      // Jest relies on babel.config.js, which transpiles everything
      // into CJS).
      modules: 'cjs',
      targets: 'maintained node versions',
      ...options,
    },
  );

  const baseAssetsOutputPath = options.baseAssetsOutputPath ?? '';
  config.plugins!.push(
    ['@dr.pogodin/transform-assets', {
      extensions: ['gif', 'jpeg', 'jpg', 'png'],
      name: `${baseAssetsOutputPath}/images/[md4:hash:20].[ext]`,
    }],
  );

  if (options.modules === false) {
    config.plugins!.push('babel-plugin-add-import-extension');
  }

  const moduleResolverPluginOps = (config.plugins!.find(
    (x) => Array.isArray(x) && x[0] === 'module-resolver',
  ) as [PluginTarget, PluginOptions])[1] as ModuleResolverOptionsI;
  moduleResolverPluginOps.transformFunctions = [
    'requireWeak',
    'resolveWeak',
    'webpack.requireWeak',
    'webpack.resolveWeak',
  ];

  if (babel.env() === ENVIRONMENTS.DEV as string) {
    pull(config.plugins!, 'react-refresh/babel');
  }

  return config;
}

/**
 * Updates given `config` with styling ((S)CSS-related) setup.
 *
 * **Beware:** It mutates `config`.
 *
 * @param config
 */
function addStyling(config: TransformOptions): TransformOptions {
  const cssModulesOps = (config.plugins!.find(
    (item) => Array.isArray(item) && item[0] === '@dr.pogodin/react-css-modules',
  ) as [PluginTarget, PluginOptions])[1] as ReactCssModulesOptionsT;
  cssModulesOps.replaceImport = true;
  return config;
}

/**
 * Generates Babel config for NodeJS compilation and server-side  execution.
 * @param babel Babel compiler instance.
 * @param [ops] Preset options. It supports all options accepted by
 *  the underlying {@link module:babel/webpack preset for Webpack}, but it
 *  overrides `targets` option by `current node` value, and also accepts
 *  the following additional options:
 * @param [ops.baseAssetsOutputPath] Path prefix for emitted image
 *  assets.
 * @return Generated config.
 */
export default function getConfig(
  babel: BabelCompilerI,
  ops: OptionsT = {},
): TransformOptions {
  const config = newBase(babel, ops);
  if (!ops.noStyling) addStyling(config);
  return config;
}
