import { pull } from 'lodash';

import {
  type PluginOptionsT as ReactCssModulesOptionsT,
} from '@dr.pogodin/babel-plugin-react-css-modules';

import getWebpackBabelConfig, {
  type BabelCompilerI,
  type ConfigT,
  type OptionsT as WebpackConfigOptionsT,
  type PresetOrPluginOptionsI,
  ENVIRONMENTS,
} from './webpack';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ModuleResolverOptionsI extends PresetOrPluginOptionsI {
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
      modules: 'cjs',
      targets: 'current node',
      ...options,
    },
  );

  const baseAssetsOutputPath = options.baseAssetsOutputPath ?? '';
  config.plugins.push(
    ['@dr.pogodin/transform-assets', {
      extensions: ['gif', 'jpeg', 'jpg', 'png'],
      name: `${baseAssetsOutputPath}/images/[md4:hash:20].[ext]`,
    }],
  );

  const moduleResolverPluginOps = (config.plugins.find(
    (x) => x[0] === 'module-resolver',
  ))![1] as ModuleResolverOptionsI;
  moduleResolverPluginOps.transformFunctions = [
    'requireWeak',
    'resolveWeak',
    'webpack.requireWeak',
    'webpack.resolveWeak',
  ];

  if (babel.env() === ENVIRONMENTS.DEV as string) {
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
function addStyling(config: ConfigT) {
  const cssModulesOps = config.plugins.find(
    ([name]) => name === '@dr.pogodin/react-css-modules',
  )![1] as ReactCssModulesOptionsT;
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
export default function getConfig(babel: BabelCompilerI, ops: OptionsT = {}) {
  const config = newBase(babel, ops);
  if (!ops.noStyling) addStyling(config);
  return config;
}
