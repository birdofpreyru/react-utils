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

// As this environment is a part of the Jest testing utils,
// we assume development dependencies are available when it is used.
/* eslint-disable import/no-extraneous-dependencies */

import { fork } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';

import JsdomEnv from 'jest-environment-jsdom';
import { defaults, set } from 'lodash-es';
import { Volume, createFsFromVolume } from 'memfs';
import webpack, { type Configuration, type Stats } from 'webpack';

import register, { revert } from '@babel/register';

import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';

import { deduceChunkGroups } from 'server/renderer';

import type { LaunchT, ResultT } from './ssr';

async function findModule(module: string): Promise<string> {
  try {
    const res = `${module}.ts`;
    await access(res);
    return res;
  } catch {
    // NOOP
  }

  try {
    const res = `${module}.js`;
    await access(res);
    return res;
  } catch {
    // NOOP
  }

  throw Error(`Module "${module}" was not found, neither as TS, nor as JS`);
}

export default class E2eSsrEnv extends JsdomEnv {
  pragmas: Record<string, string | string[]>;

  ssrRequest: object;

  rootDir: string;

  testFolder: string;

  withSsr: boolean;

  webpackStats?: Stats;

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
    // NOTE: This is a TS module in the source code, and it turn into JS
    // module in the distributed code, after Babel compilation. As we rely
    // on it for the forked NodeJS process, we need to resolve the correct
    // extention ourselves (as NodeJS will hit the given path, without any
    // additional resolutions / transformations).
    const ssrModulePath = await findModule(`${import.meta.dirname}/ssr`);

    const cp = fork(ssrModulePath);

    const optionsString = this.pragmas['ssr-options'] as string;
    const options = optionsString
      ? JSON.parse(optionsString) as Record<string, unknown>
      : {};

    options.buildInfo ??= this.global.buildInfo;

    if (!this.webpackStats) throw Error('Missing Webpack stats');

    options.chunkGroups = deduceChunkGroups(this.webpackStats);

    return new Promise((resolve, reject) => {
      cp.on('exit', (code) => {
        if (code) reject(Error('SSR process crashed'));
      });

      cp.on('message', (message: ResultT) => {
        this.global.ssrMarkup = message.markup;
        this.global.ssrOptions = options;
        this.global.ssrStatus = message.status;
        cp.kill();
        resolve();
      });

      if (!this.global.webpackConfig) throw Error('Missing Webpack config');

      cp.send({
        options,
        root: options.root === 'TEST' ? this.testFolder : process.cwd(),
        ssrRequest: this.ssrRequest,
        testFolder: this.testFolder,
        webpackConfig: this.global.webpackConfig,
      } satisfies LaunchT);
    });
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

    // BEWARE: Anything imported prior to this register() call seems to be
    // transpiled again by Babel if loaded after this call. This causes very
    // confusing errors when testing the code dependent on some sort of contexts
    // (because loading a module again effectively creates a new context object,
    // which is not recognized by the code expecting another context instance).
    // That's why below we prefer dynamic imports for some React Utils methods.
    // BEWARE: Although we also do the registration inside SSR testing code,
    // we still need it here to correctly process imported Webpack configurations
    // (which are imported directly from this module).
    register({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
    });
  }

  async setup(): Promise<void> {
    await super.setup();
    await this.runWebpack();

    // eslint-disable-next-line import/dynamic-import-chunkname
    const { setBuildInfo } = await import('../../isomorphy/buildInfo');
    setBuildInfo(undefined, true);

    if (this.withSsr) await this.runSsr();
    this.global.REACT_UTILS_FORCE_CLIENT_SIDE = true;
  }

  async teardown(): Promise<void> {
    delete this.global.REACT_UTILS_FORCE_CLIENT_SIDE;

    revert();

    await super.teardown();
  }
}
