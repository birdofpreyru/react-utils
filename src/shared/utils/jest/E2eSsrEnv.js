/**
 * Jest environment for end-to-end SSR and client-side testing. It relies on
 * the standard react-utils mechanics to execute SSR of given scene, and also
 * Webpack build of the code for client-side execution, it further exposes
 * Jsdom environment for the client-side testing of the outcomes.
 */

import path from 'path';
import { defaults, noop } from 'lodash';
import ssrFactory from 'server/renderer';

// As this environment is a part of the Jest testing utils,
// we assume development dependencies are available when it is used.
/* eslint-disable import/no-extraneous-dependencies */
import JsdomEnv from 'jest-environment-jsdom';
import { createFsFromVolume, Volume } from 'memfs';
import webpack from 'webpack';
/* eslint-enable import/no-extraneous-dependencies */

class E2eSsrEnv extends JsdomEnv {
  /**
   * Gets Webpack config, saving it into .webpackConfig field of the environment
   * object.
   * @param {object} config
   * @param {object} context
   */
  loadWebpackConfig(config, context) {
    const { rootDir } = config.projectConfig;
    const testFolder = path.dirname(context.testPath);

    const pragmas = context.docblockPragmas;

    let configFactoryPath = pragmas['webpack-config-factory'];
    configFactoryPath = path.resolve(rootDir, configFactoryPath);

    let configOptions = pragmas['webpack-config-options'];
    configOptions = defaults(
      configOptions ? JSON.parse(configOptions) : {},
      {
        context: testFolder,
        dontEmitBuildInfo: true,
      },
    );

    // TODO: This entire block should be in a separate method, I guess.
    if (pragmas['no-ssr']) this.noSsr = true;
    else {
      let ssrOptions = pragmas['ssr-options'];
      ssrOptions = ssrOptions ? JSON.parse(ssrOptions) : {};

      // Note: This ensures that Babel is used to transform imports used during
      // the environment preparation, in particular the application code imported
      // dynamically for SSR purposes.
      /* eslint-disable global-require, import/no-extraneous-dependencies */
      require('@babel/register')({
        envName: ssrOptions.babelEnv,
        extensions: ['.js', '.jsx', '.svg'],
      });
      /* eslint-disable global-require, import/no-extraneous-dependencies */

      if (ssrOptions.Application) {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        ssrOptions.Application = require(
          path.resolve(testFolder, ssrOptions.Application),
        ).default;
      }

      let ssrRequest = pragmas['ssr-request'];
      ssrRequest = ssrRequest ? JSON.parse(ssrRequest) : {};
      this.global.ssrOptions = ssrOptions;
      this.global.ssrRequest = ssrRequest;
    }

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const factory = require(path.resolve(rootDir, configFactoryPath));

    this.global.webpackConfig = factory(configOptions);
    this.global.buildInfo = factory.buildInfo;
  }

  async runWebpackBuild() {
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
    const { ssrOptions } = this.global;
    if (!ssrOptions.buildInfo) ssrOptions.buildInfo = this.global.buildInfo;

    const renderer = ssrFactory(
      this.global.webpackConfig,
      this.global.ssrOptions,
    );

    const ssrMarkup = await new Promise((done, fail) => {
      renderer(
        this.global.ssrRequest,

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

    this.global.ssrMarkup = ssrMarkup;
  }

  constructor(config, context) {
    super(config, context);
    this.loadWebpackConfig(config, context);
  }

  async setup() {
    await super.setup();
    await this.runWebpackBuild();
    if (!this.noSsr) await this.runSsr();
  }
}

export default E2eSsrEnv;
