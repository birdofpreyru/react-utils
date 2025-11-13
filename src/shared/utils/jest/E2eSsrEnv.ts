/**
 * Jest environment for end-to-end SSR and client-side testing. It relies on
 * the standard react-utils mechanics to execute SSR of given scene, and also
 * Webpack build of the code for client-side execution, it further exposes
 * Jsdom environment for the client-side testing of the outcomes.
 */

// BEWARE: The module is not imported into the JU module / the main assembly of
// the library, because doing so easily breaks stuff:
//  1)  This module depends on Node-specific modules, which would make JU
//      incompatible with JsDom if included into JU.
//  2)  If this module is weakly imported from somewhere else in the lib,
//      it seems to randomly break tests using it for a different reason,
//      probably some sort of a require-loop, or some issues with weak
//      require in that scenario.

// TODO: We need to add correct typing for environment options.

import path from 'node:path';

import type { Request, Response } from 'express';

import { defaults, set } from 'lodash-es';

import type { ReactNode } from 'react';

// As this environment is a part of the Jest testing utils,
// we assume development dependencies are available when it is used.
/* eslint-disable import/no-extraneous-dependencies */
import register from '@babel/register/experimental-worker';

import JsdomEnv from 'jest-environment-jsdom';
import { Volume, createFsFromVolume } from 'memfs';
import webpack, { type Configuration } from 'webpack';
/* eslint-enable import/no-extraneous-dependencies */

import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';

function noop() {
  // NOOP
}

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
  private async loadWebpackConfig() {
    const optionsString = this.pragmas['webpack-config-options'] as string;

    const options = (optionsString ? JSON.parse(optionsString) : {}) as
      webpack.Configuration;

    defaults(options, {
      context: this.testFolder,
      fs: this.global.webpackOutputFs,
    });

    const factoryPath = this.pragmas['webpack-config-factory'] as string;

    let factory = await import(/* webpackChunkName: "not-a-valid-chunk" */
      path.resolve(this.rootDir, factoryPath)
    ) as (((ops: Configuration) => Configuration) | {
      default: (ops: Configuration) => Configuration;
    });

    factory = 'default' in factory ? factory.default : factory;

    this.global.webpackConfig = factory(options);

    const fs = this.global.webpackOutputFs;
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
  async runWebpack(): Promise<void> {
    await this.loadWebpackConfig();

    if (!this.global.webpackConfig) throw Error('Failed to load Webpack config');
    const compiler = webpack(this.global.webpackConfig);
    if (!compiler) throw Error('Failed to construct Webpack compiler');

    // TODO: The "as typeof compiler.outputFileSystem" piece below is
    // a workaround for the Webpack regression:
    // https://github.com/webpack/webpack/issues/18242
    compiler.outputFileSystem = this.global.webpackOutputFs as
      typeof compiler.outputFileSystem;

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

  async runSsr(): Promise<void> {
    const optionsString = this.pragmas['ssr-options'] as string;
    const options = optionsString
      ? JSON.parse(optionsString) as Record<string, unknown>
      : {};

    // TODO: This is temporary to shortcut the logging added to SSR.
    options.logger ??= {
      debug: noop,
      info: noop,
      log: noop,
      warn: noop,
    };

    options.buildInfo ??= this.global.buildInfo;

    let cleanup: (() => void) | undefined;

    if (options.entry) {
      const p = path.resolve(this.testFolder, options.entry as string);
      const module = await import(/* webpackChunkName: "not-a-valid-chunk" */
        p
      ) as NodeJS.Module;

      if ('cleanup' in module) cleanup = module.cleanup as () => void;

      const exportName = (options.entryExportName as string) || 'default';
      if (exportName in module) {
        options.Application = (
          module as unknown as Record<string, unknown>
        )[exportName] as ReactNode;
      }
    }

    const { default: ssrFactory } = await import(/* webpackChunkName: "not-a-valid-chunk" */ 'server/renderer');
    const renderer = ssrFactory(this.global.webpackConfig!, options);
    let status = 200; // OK
    const markup = await new Promise<string>((done, fail) => {
      void renderer(
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
          // TODO: Strictly speaking, that error as Error casting is not all
          // correct, but it works, so no need to spend time on it right now.
          if (error) fail(error as Error);
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
    const request = requestString
      ? JSON.parse(requestString) as Record<string, unknown>
      : {};

    request.url ??= '/';
    request.csrfToken = noop;

    // This ensures the initial JsDom URL matches the value we use for SSR.
    set(
      config.projectConfig,
      'testEnvironmentOptions.url',
      `http://localhost${request.url as string}`,
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
    const options = optionsString
      ? JSON.parse(optionsString) as Record<string, unknown>
      : {};
    let root;
    switch (options.root) {
      case 'TEST':
        root = this.testFolder;
        break;
      default: root = process.cwd();
    }

    // BEWARE: Anything imported prior to this register() call seems to be
    // transpiled again by Babel if loaded after this call. This causes very
    // confusing errors when testing the code dependent on some sort of contexts
    // (because loading a module again effectively creates a new context object,
    // which is not recognized by the code expecting another context instance).
    // That's why below we prefer dynamic imports for some React Utils methods.
    register({
      envName: options.babelEnv as string,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
      root,
    });
  }

  async setup(): Promise<void> {
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

    const { setBuildInfo } = await import(/* webpackChunkName: "not-a-valid-chunk" */'../isomorphy/buildInfo');
    setBuildInfo(undefined, true);

    if (this.withSsr) await this.runSsr();
    this.global.REACT_UTILS_FORCE_CLIENT_SIDE = true;
  }

  async teardown(): Promise<void> {
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
    await super.teardown();
  }
}
