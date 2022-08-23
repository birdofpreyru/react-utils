/**
 * Jest environment for end-to-end SSR and client-side testing. It relies on
 * the standard react-utils mechanics to execute SSR of given scene, and also
 * Webpack build of the code for client-side execution, it further exposes
 * Jsdom environment for the client-side testing of the outcomes.
 */
/* eslint-disable global-require, import/no-dynamic-require */

// BEWARE: The module is not imported into the JU module / the main assembly of
// the library, because doing so easily breaks stuff:
//  1)  This module depends on Node-specific modules, which would make JU
//      incompatible with JsDom if included into JU.
//  2)  If this module is weakly imported from somewhere else in the lib,
//      it seems to randomly break tests using it for a different reason,
//      probably some sort of a require-loop, or some issues with weak
//      require in that scenario.

import path from 'path';
import ssrFactory from 'server/renderer';

import { defaults, noop, set } from 'lodash';

// As this environment is a part of the Jest testing utils,
// we assume development dependencies are available when it is used.
/* eslint-disable import/no-extraneous-dependencies */
import register from '@babel/register';
import JsdomEnv from 'jest-environment-jsdom';
import { createFsFromVolume, Volume } from 'memfs';
import webpack from 'webpack';
/* eslint-enable import/no-extraneous-dependencies */

export default class E2eSsrEnv extends JsdomEnv {
  /**
   * Loads Webpack config, and exposes it to the environment via global
   * webpackConfig object.
   */
  loadWebpackConfig() {
    let options = this.pragmas['webpack-config-options'];
    options = options ? JSON.parse(options) : {};
    defaults(options, {
      context: this.testFolder,
      fs: this.global.webpackOutputFs,
    });

    let factory = this.pragmas['webpack-config-factory'] || '';
    factory = require(path.resolve(this.rootDir, factory));
    this.global.webpackConfig = factory(options);

    const fs = this.global.webpackOutputFs;
    let buildInfo = `${options.context}/.build-info`;
    if (fs.existsSync(buildInfo)) {
      buildInfo = fs.readFileSync(buildInfo, 'utf8');
      this.global.buildInfo = JSON.parse(buildInfo);
    }
  }

  /**
   * Executes Webpack build.
   * @return {Promise}
   */
  async runWebpack() {
    this.loadWebpackConfig();

    const compiler = webpack(this.global.webpackConfig);
    compiler.outputFileSystem = this.global.webpackOutputFs;
    return new Promise((done, fail) => {
      compiler.run((err, stats) => {
        if (err) fail(err);

        this.global.webpackStats = stats.toJson();

        // Keeps reference to the raw Webpack stats object, which should be
        // explicitly passed to the server-side renderer alongside the request,
        // so that it can to pick up asset paths for different named chunks.
        this.webpackStats = stats;

        done();
      });
    });
  }

  async runSsr() {
    let options = this.pragmas['ssr-options'];
    options = options ? JSON.parse(options) : {};

    // TODO: This is temporary to shortcut the logging added to SSR.
    if (options.logger === undefined) {
      options.logger = {
        debug: noop,
        info: noop,
        log: noop,
        warn: noop,
      };
    }

    let root;
    switch (options.root) {
      case 'TEST': root = this.testFolder; break;
      default: root = process.cwd();
    }

    // Note: This enables Babel transformation for the code dynamically loaded
    // below, as the usual Jest Babel setup does not seem to apply to
    // the environment code, and imports from it.
    register({
      envName: options.babelEnv,
      extensions: ['.js', '.jsx', '.svg'],
      root,
    });

    if (!options.buildInfo) options.buildInfo = this.global.buildInfo;

    if (options.entry) {
      const p = path.resolve(this.testFolder, options.entry);
      options.Application = require(p)[options.entryExportName || 'default'];
    }

    const renderer = ssrFactory(this.global.webpackConfig, options);
    let status = 200; // OK
    const markup = await new Promise((done, fail) => {
      renderer(
        this.ssrRequest,

        // TODO: This will do for now, with the current implementation of
        // the renderer, but it will require a rework once the renderer is
        // updated to do streaming.
        {
          cookie: noop,
          send: done,
          set: noop,
          status: (value) => {
            status = value;
          },

          // This is how up-to-date Webpack stats are passed to the server in
          // development mode, and we use this here always, instead of having
          // to pass some information via filesystem.
          locals: {
            webpack: {
              devMiddleware: {
                stats: this.webpackStats,
              },
            },
          },
        },

        (error) => {
          if (error) fail(error);
          else done('');
        },
      );
    });

    this.global.ssrMarkup = markup;
    this.global.ssrOptions = options;
    this.global.ssrStatus = status;
  }

  constructor(config, context) {
    const pragmas = context.docblockPragmas;
    let request = pragmas['ssr-request'];
    request = request ? JSON.parse(request) : {};
    if (!request.url) request.url = '/';
    request.csrfToken = noop;

    // This ensures the initial JsDom URL matches the value we use for SSR.
    set(
      config.projectConfig,
      'testEnvironmentOptions.url',
      `http://localhost${request.url}`,
    );

    super(config, context);

    this.global.dom = this.dom;
    this.global.webpackOutputFs = createFsFromVolume(new Volume());

    // Extracts necessary settings from config and context.
    const { projectConfig } = config;
    this.rootDir = projectConfig.rootDir;
    this.testFolder = path.dirname(context.testPath);
    this.withSsr = !pragmas['no-ssr'];
    this.ssrRequest = request;
    this.pragmas = pragmas;
  }

  async setup() {
    await super.setup();
    await this.runWebpack();
    if (this.withSsr) await this.runSsr();
    this.global.REACT_UTILS_FORCE_CLIENT_SIDE = true;
  }

  async teardown() {
    delete this.global.REACT_UTILS_FORCE_CLIENT_SIDE;

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
