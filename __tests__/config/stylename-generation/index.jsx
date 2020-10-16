import path from 'path';

import { snapshot } from 'utils/jest';
import webpack, { ProgressPlugin } from 'webpack';

import webpackConfigFactory from '../../../config/webpack/app-development';

import TestComponent from './__assets__/TestComponent';

it('Babel stylename generation', () => {
  snapshot(<TestComponent />);
});

it('Webpack stylename generation', (done) => {
  const webpackConfig = webpackConfigFactory({
    cssLocalIdent: '[path][name]___[local]___[hash:base64:6]',
    context: path.resolve(__dirname, '../../..'),
    dontEmitBuildInfo: true,
    dontTimestampOutputs: true,
  });
  webpackConfig.plugins = webpackConfig.plugins.filter(
    (plugin) => !(plugin instanceof ProgressPlugin),
  );

  webpackConfig.entry = './__tests__/config/stylename-generation/__assets__/TestComponent/index.jsx';
  const babelLoader = webpackConfig.module.rules.find(
    (x) => x.loader === 'babel-loader',
  );
  babelLoader.options.presets[0] = path.resolve(
    __dirname,
    '../../../config/babel/webpack',
  );

  const compiler = webpack(webpackConfig);
  compiler.hooks.shouldEmit.tap('Test', () => false);

  compiler.run((err, stats) => {
    try {
      expect(err).toBe(null);
      expect(stats.hasErrors()).toBe(false);
      /* eslint-disable no-underscore-dangle */
      const compiledCss = stats.compilation.assets['main.css']
        ._source._children[0]._value;
      expect(compiledCss).toMatchSnapshot();
      expect(
        compiledCss.includes(
          '.__tests__-config-stylename-generation-__assets__-TestComponent-style___testClassName___1v_vvw',
        ),
      ).toBe(true);
      done();
      /* eslint-enable no-underscore-dangle */
    } catch (error) {
      done(error);
    }
  });
  compiler.close(() => null);
}, 30000);
