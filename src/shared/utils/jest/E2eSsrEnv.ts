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

import type { Request, Response } from 'express';
import { defaults, noop, set } from 'lodash';

// As this environment is a part of the Jest testing utils,
// we assume development dependencies are available when it is used.
/* eslint-disable import/no-extraneous-dependencies */
import register from '@babel/register/experimental-worker';

import JsdomEnv from 'jest-environment-jsdom';
import { type IFs, createFsFromVolume, Volume } from 'memfs';
import webpack from 'webpack';
/* eslint-enable import/no-extraneous-dependencies */

import ssrFactory from 'server/renderer';

import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';

import { setBuildInfo } from '../isomorphy/buildInfo';

export default class E2eSsrEnv extends JsdomEnv {
  pragmas: Record<string, string | string[]>;

  ssrRequest: object;

  rootDir: string;

  testFolder: string;

  withSsr: boolean;

  webpackStats?: webpack.StatsCompilation;

  /**
   * Loads Webpack config, and exposes it to the environment via global
   * webpackConfig object.
   */
  loadWebpackConfig() {
    const optionsString = this.pragmas['webpack-config-options'] as string;

    const options = (optionsString
      ? JSON.parse(optionsString) : {}) as webpack.Configuration;

    defaults(options, {
      context: this.testFolder,
      fs: this.global.webpackOutputFs,
    });

    const factoryPath = this.pragmas['webpack-config-factory'] as string;
    let factory = require(path.resolve(this.rootDir, factoryPath));
    factory = 'default' in factory ? factory.default : factory;

    this.global.webpackConfig = factory(options);

    const fs = this.global.webpackOutputFs as IFs;
    let buildInfo = `${options.context}/.build-info`;
    if (fs.existsSync(buildInfo)) {
      buildInfo = fs.readFileSync(buildInfo, 'utf8') as string;
      this.global.buildInfo = JSON.parse(buildInfo);
    }
  }

  /**
   * Executes Webpack build.
   * @return {Promise}
   */
  async runWebpack() {
    this.loadWebpackConfig();

    const compiler = webpack(this.global.webpackConfig as webpack.Configuration);

    // TODO: The "as typeof compiler.outputFileSystem" piece below is a workaround
    // for the Webpack regression: https://github.com/webpack/webpack/issues/18242
    compiler.outputFileSystem = this.global.webpackOutputFs as typeof compiler.outputFileSystem;

    return new Promise<void>((done, fail) => {
      compiler.run((err, stats) => {
        if (err) fail(err);
        if (stats?.hasErrors()) {
          // eslint-disable-next-line no-console
          console.error(stats.toJson().errors);
          fail(Error('Webpack compilation failed'));
        }

        this.global.webpackStats = stats?.toJson();

        // Keeps reference to the raw Webpack stats object, which should be
        // explicitly passed to the server-side renderer alongside the request,
        // so that it can to pick up asset paths for different named chunks.
        this.webpackStats = stats;

        done();
      });
    });
  }

  async runSsr() {
    const optionsString = this.pragmas['ssr-options'] as string;
    const options = optionsString ? JSON.parse(optionsString) : {};

    // TODO: This is temporary to shortcut the logging added to SSR.
    if (options.logger === undefined) {
      options.logger = {
        debug: noop,
        info: noop,
        log: noop,
        warn: noop,
      };
    }

    if (!options.buildInfo) options.buildInfo = this.global.buildInfo;

    let cleanup: (() => void) | undefined;

    if (options.entry) {
      const p = path.resolve(this.testFolder, options.entry);
      const module = require(p);
      cleanup = module.cleanup;
      options.Application = module[options.entryExportName || 'default'];
    }

    const renderer = ssrFactory(this.global.webpackConfig!, options);
    let status = 200; // OK
    const markup = await new Promise<string>((done, fail) => {
      renderer(
        this.ssrRequest as Request,

        // TODO: This will do for now, with the current implementation of
        // the renderer, but it will require a rework once the renderer is
        // updated to do streaming.
        ({
          cookie: noop,
          send: done,
          set: noop,
          status: (value: number) => {
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
        } as unknown) as Response,

        (error) => {
          if (error) fail(error);
          else done('');
        },
      );
    });

    this.global.ssrMarkup = markup;
    this.global.ssrOptions = options;
    this.global.ssrStatus = status;

    if (cleanup) cleanup();
  }

  constructor(
    config: JestEnvironmentConfig,
    context: EnvironmentContext,
  ) {
    const pragmas = context.docblockPragmas;

    const requestString = pragmas['ssr-request'] as string;
    const request = requestString ? JSON.parse(requestString) : {};

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

    // The usual "babel-jest" transformation setup does not apply to
    // the environment code and imports from it, this workaround enables it.
    const optionsString = this.pragmas['ssr-options'] as string;
    const options = optionsString ? JSON.parse(optionsString) : {};
    let root;
    switch (options.root) {
      case 'TEST': root = this.testFolder; break;
      default: root = process.cwd();
    }
    register({
      envName: options.babelEnv,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
      root,
    });
  }

  async setup() {
    await super.setup();
    await this.runWebpack();

    // NOTE: It is possible that the Webpack run above, and the SSR run below
    // load different versions of the same module (CommonJS, and ES), and it may
    // cause very confusing problems (e.g. see:
    // https://github.com/birdofpreyru/react-utils/issues/413).
    // It seems we can't reset the cache of ES modules, and Jest's module reset
    // does not reset modules loaded in this enviroment module, and also only
    // replacing entire cache object by and empty {} seems to help (in contrast
    // to deleting all entries by their keys, as it is done within .teardown()
    // method below). Thus, for now we do this as a hotfix, and we also reset
    // build info to undefined, because ES module version not beeing reset
    // triggers an error on the subsequent test using the environment.
    // TODO: Look for a cleaner solution.
    require.cache = {};
    setBuildInfo(undefined, true);

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
