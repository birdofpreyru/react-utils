import path from 'path';

import webpack, { ProgressPlugin } from 'webpack';

import { snapshot } from 'utils/jest';

import webpackConfigFactoryAppDev
  from '../../../config/webpack/app-production';

import App from './__assets__';

function testWebpackBuild(configFactory) {
  const config = configFactory({
    context: process.cwd(),
    dontEmitBuildInfo: true,
  });
  config.plugins = config.plugins.filter((p) => !(p instanceof ProgressPlugin));
  config.entry = './__tests__/config/png-imports/__assets__';
  const babelLoader = config.module.rules.find(
    (x) => x.loader === 'babel-loader',
  );
  babelLoader.options.presets[0] = path.resolve('config/babel/webpack');
  const compiler = webpack(config);
  compiler.hooks.shouldEmit.tap('Test', () => false);
  return new Promise((resolve) => {
    compiler.run((err, stats) => {
      expect(err).toBe(null);
      expect(stats.compilation.errors).toEqual([]);
      const pngChunkName = Object.keys(stats.compilation.assets)
        .find((key) => key.endsWith('.png'));
      expect(pngChunkName).toMatchSnapshot();
      resolve(pngChunkName);
    });
  });
}

test('Client-side import', async () => {
  await testWebpackBuild(webpackConfigFactoryAppDev);
}, 30000);

test('Server-side import', () => {
  // NOTE: The PNG asset name in the snapshot must match that generated
  // in Webpack builds.
  snapshot(<App />);
});
