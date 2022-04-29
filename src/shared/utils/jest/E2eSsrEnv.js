/**
 * Jest environment for end-to-end SSR and client-side testing. It relies on
 * the standard react-utils mechanics to execute SSR of given scene, and also
 * Webpack build of the code for client-side execution, it further exposes
 * Jsdom environment for the client-side testing of the outcomes.
 */
/* eslint-disable global-require, import/no-dynamic-require */

import path from 'path';
import { defaults, noop } from 'lodash';
import ssrFactory from 'server/renderer';

// As this environment is a part of the Jest testing utils,
// we assume development dependencies are available when it is used.
/* eslint-disable import/no-extraneous-dependencies */
import register from '@babel/register';
import JsdomEnv from 'jest-environment-jsdom';
import { createFsFromVolume, Volume } from 'memfs';
import webpack from 'webpack';
/* eslint-enable import/no-extraneous-dependencies */

class E2eSsrEnv extends JsdomEnv {
  /**
   * Loads Webpack config, and exposes it to the environment via global
   * webpackConfig object.
   */
  loadWebpackConfig() {
    let options = this.pragmas['webpack-config-options'];
    options = options ? JSON.parse(options) : {};
    defaults(options, {
      context: this.testFolder,
      dontEmitBuildInfo: true,
    });

    let factory = this.pragmas['webpack-config-factory'] || '';
    factory = require(path.resolve(this.rootDir, factory));
    this.global.webpackConfig = factory(options);
    this.global.buildInfo = factory.buildInfo;
  }

  /**
   * Executes Webpack build.
   * @return {Promise}
   */
  async runWebpack() {
    this.loadWebpackConfig();

    const compiler = webpack(this.global.webpackConfig);
    compiler.outputFileSystem = createFsFromVolume(new Volume());
    return new Promise((done, fail) => {
      compiler.run((err, stats) => {
        if (err) fail(err);
        this.global.webpackOutputFs = compiler.outputFileSystem;
        this.global.webpackStats = stats.toJson();
        done();
      });
    });
  }

  async runSsr() {
    let options = this.pragmas['ssr-options'];
    options = options ? JSON.parse(options) : {};

    // Note: This enables Babel transformation for the code dynamically loaded
    // below, as the usual Jest Babel setup does not seem to apply to
    // the environment code, and imports from it.
    register({
      envName: options.babelEnv,
      extensions: ['.js', '.jsx', '.svg'],
    });

    if (!options.buildInfo) options.buildInfo = this.global.buildInfo;

    if (options.entry) {
      const p = path.resolve(this.testFolder, options.entry);
      options.Application = require(p).default;
    }

    let request = this.pragmas['ssr-request'];
    request = request ? JSON.parse(request) : {};

    const renderer = ssrFactory(this.global.webpackConfig, options);
    const markup = await new Promise((done, fail) => {
      renderer(
        request,

        // TODO: This will do for now, with the current implementation of
        // the renderer, but it will require a rework once the renderer is
        // updated to do streaming.
        { send: done, set: noop },

        (error) => {
          if (error) fail(error);
          else done('');
        },
      );
    });

    this.global.ssrMarkup = markup;
    this.global.ssrOptions = options;
    this.global.ssrRequest = request;
  }

  constructor(config, context) {
    super(config, context);

    // Extracts necessary settings from config and context.
    const { projectConfig } = config;
    this.rootDir = projectConfig.rootDir;
    this.testFolder = path.dirname(context.testPath);
    this.pragmas = context.docblockPragmas;
    this.withSsr = !this.pragmas['no-ssr'];
  }

  async setup() {
    await super.setup();
    await this.runWebpack();
    if (this.withSsr) await this.runSsr();
  }

  async teardown() {
    // Resets module cache and @babel/register. Effectively this ensures that
    // the next time an instance of this environment is set up, all modules are
    // transformed by Babel from scratch, thus taking into account the latest
    // Babel config (which may change between different environment instances,
    // which does not seem to be taken into account by Babel / Node caches
    // automatically).
    Object.keys(require.cache).forEach((key) => {
      delete require.cache[key];
    });
    register.revert();
    super.teardown();
  }
}

export default E2eSsrEnv;
