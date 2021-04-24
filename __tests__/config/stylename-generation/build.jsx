/* Test of style generation in the actual server-side code and frontend bundles.
 */

import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import webpack, { ProgressPlugin } from 'webpack';

import webpackConfigFactoryAppDev
  from '../../../config/webpack/app-development';
import webpackConfigFactoryAppProd
  from '../../../config/webpack/app-production';
import webpackConfigFactoryLibDev
  from '../../../config/webpack/lib-development';
import webpackConfigFactoryLibProd
  from '../../../config/webpack/lib-production';

const tmpDir = `${__dirname}/__tmp__`;
const BABEL = path.resolve('node_modules/.bin/babel');

/**
 * Auxiliary wrapper around the command execution in a child process.
 *
 * TODO: Move to a server-side unitility module.
 * TODO: It is a duplication: the same code is in build script.
 *
 * @param {String} command Command to execute;
 * @param {Object} [options] See https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 * @return {Promise} Resolves to { error, stdout, stderr }.
 */
async function exec(command, options = {}) {
  return new Promise((resolve) => {
    const child = childProcess.exec(
      command,
      options,
      (...args) => resolve(args),
    );
    if (!options.nopipe) {
      child.stderr.pipe(process.stderr);
      child.stdout.pipe(process.stdout);
    }
  });
}

describe('Babel build', () => {
  beforeEach(() => {
    rimraf.sync(tmpDir);
  });

  afterEach(() => {
    rimraf.sync(tmpDir);
  });

  it('Node: development', async () => {
    await exec(`${BABEL} ${__dirname}/__assets__ --out-dir ${tmpDir}`, {
      env: { ...process.env, BABEL_ENV: 'development' },
    });
    let generated = fs.readFileSync(`${tmpDir}/index.js`, 'utf8');
    expect(generated).toMatchSnapshot();
    generated = fs.readFileSync(
      `${tmpDir}/MockPackageA/TestComponent/index.js`,
      'utf8',
    );
    expect(generated).toMatchSnapshot();
  }, 60000);

  it('Node: production', async () => {
    await exec(`${BABEL} ${__dirname}/__assets__ --out-dir ${tmpDir}`, {
      env: { ...process.env, BABEL_ENV: 'production' },
    });
    let generated = fs.readFileSync(`${tmpDir}/index.js`, 'utf8');
    expect(generated).toMatchSnapshot();
    generated = fs.readFileSync(
      `${tmpDir}/MockPackageA/TestComponent/index.js`,
      'utf8',
    );
    expect(generated).toMatchSnapshot();
  }, 60000);
});

function testWebpackBuild(configFactory) {
  const config = configFactory({
    context: process.cwd(),
    dontEmitBuildInfo: true,
  });
  config.plugins = config.plugins.filter((p) => !(p instanceof ProgressPlugin));
  config.entry = './__tests__/config/stylename-generation/__assets__';
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
      const cssChunkName = Object.keys(stats.compilation.assets)
        .find((key) => key.endsWith('.css'));

      /* eslint-disable no-underscore-dangle */
      let asset = stats.compilation.assets[cssChunkName];
      if (asset._source) asset = asset._source;
      const compiledCss = asset._value
        || asset._children.map(({ _value }) => _value).join('\n');
      /* eslint-enable no-underscore-dangle */

      expect(compiledCss).toMatchSnapshot();
      resolve(stats);
    });
  });
}

describe('Webpack build', () => {
  it('App: development', async () => {
    await testWebpackBuild(webpackConfigFactoryAppDev);
  }, 30000);

  it('App: production', async () => {
    await testWebpackBuild(webpackConfigFactoryAppProd);
  }, 30000);

  it('Lib: development', async () => {
    await testWebpackBuild(webpackConfigFactoryLibDev);
  }, 30000);

  it('Lib: production', async () => {
    await testWebpackBuild(webpackConfigFactoryLibProd);
  }, 30000);
});
