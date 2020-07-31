import path from 'path';

import React from 'react';
import { snapshot } from 'utils/jest';
import webpack from 'webpack';
import time from 'utils/time';

import webpackConfigFactory from '../../../config/webpack/app-development';

import TestComponent from './__assets__/TestComponent';

it('Babel stylename generation', () => {
  snapshot(<TestComponent />);
});

it('Webpack stylename generation', (done) => {
  const webpackConfig = webpackConfigFactory({
    cssLocalIdent: '[path]___[name]__[local]___[hash:base64:5]',
    context: path.resolve(__dirname, '../../..'),
    dontEmitBuildInfo: true,
    dontTimestampOutputs: true,
  });
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
    expect(err).toBe(null);
    expect(stats.hasErrors()).toBe(false);
    /* eslint-disable no-underscore-dangle */
    const compiledCss = stats.compilation.assets['main.css']
      ._source.children[0]._value;
    expect(compiledCss).toMatchSnapshot();
    expect(
      compiledCss.startsWith(
        '.__tests__-config-stylename-generation-__assets__-TestComponent-___style__testClassName___2QV-B',
      ),
    ).toBe(true);
    /* eslint-enable no-underscore-dangle */
    done();
  });
}, 30 * time.SEC_MS);
