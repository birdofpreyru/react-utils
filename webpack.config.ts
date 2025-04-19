/* global __dirname */

import type { Configuration } from 'webpack';

import devConfigFactory from './config/webpack/lib-development';
import prodConfigFactory from './config/webpack/lib-production';

type EnvT = 'development' | 'production';

export default function buildConfig(env: EnvT): Configuration {
  let factory: typeof devConfigFactory | typeof prodConfigFactory;

  switch (env) {
    case 'development':
      factory = devConfigFactory;
      break;
    case 'production':
      factory = prodConfigFactory;
      break;
    default: throw Error('Invalid configuration environment');
  }

  const config = factory({
    babelEnv: env,
    context: __dirname,
    entry: './src',
    library: '@dr.pogodin/react-utils',
    mode: env,
    typescript: true,
  });

  // The lib config is intended for use outside of this very package,
  // so we need some tweaks here to make it work for this package itself.
  const babelLoader = config.module?.rules?.find(
    (x) => typeof x === 'object' && x?.loader === 'babel-loader',
  );

  if (
    typeof babelLoader !== 'object'
    || !babelLoader
    || typeof babelLoader.options !== 'object'
    || !Array.isArray(babelLoader.options.presets)
    || !Array.isArray(babelLoader.options.presets[0])
  ) throw Error('Invalid base config');

  babelLoader.options.presets[0][0] = `${__dirname}/config/babel/webpack`;

  return config;
}
