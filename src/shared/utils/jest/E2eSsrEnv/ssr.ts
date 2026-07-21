import { resolve } from 'node:path';

import type { Request, Response } from 'express';
import type { Configuration } from 'webpack';

import { registerBabelLoader } from 'server';
import ssrFactory from 'server/renderer';

export type LaunchT = {
  // TODO: Should it be typed as the renderer's options type?
  options: Record<string, unknown>;

  root: string;
  ssrRequest: object;
  testFolder: string;
  webpackConfig: Configuration;
};

export type ResultT = {
  markup: string;
  status: number;
};

function noop() {
  // NOOP
}

async function run({
  options,
  root,
  ssrRequest,
  testFolder,
  webpackConfig,
}: LaunchT) {
  // NOTE: It looks like @babel/register does not work for us here, because
  // it only supports transpiling of modules loaded with require(), so here
  // is, presumably, a temporary workaround relying on the new NodeJS module
  // API, and Babel's core, to transpile all modules loaded further into
  // CommonJS. I guess, later we'll be able to get rid of this, as Babel
  // register supports runtime transformation of modules loaded with import().
  registerBabelLoader({ envName: options.babelEnv as string, root });

  if (options.entry) {
    const p = resolve(testFolder, options.entry as string);
    // eslint-disable-next-line import/dynamic-import-chunkname
    const babelModule = await import(p) as NodeJS.Module;

    // TODO: This is basically a hotfix hack, which works both for the library
    // itself, and for dependent projects... (those tested so far). It sure has
    // to be reworked later.
    /* eslint-disable no-underscore-dangle */
    const module = (
      '__esModule' in babelModule
      && typeof babelModule.__esModule === 'boolean'
      && babelModule.__esModule
      && 'default' in babelModule
        ? babelModule.default : babelModule
    ) as NodeJS.Module;
    /* eslint-enable no-underscore-dangle */

    const exportName = (options.entryExportName as string) || 'default';
    if (exportName in module) {
      // eslint-disable-next-line no-param-reassign
      options.Application = (
        module as unknown as Record<string, unknown>
      )[exportName];
      // eslint-disable-next-line no-param-reassign
    } else options.Application = module;
  }

  const renderer = ssrFactory(webpackConfig, options);
  let status = 200; // OK

  // eslint-disable-next-line no-param-reassign
  (ssrRequest as Request).csrfToken = () => '';

  const markup = await new Promise<string>((done, fail) => {
    void renderer(
      ssrRequest as Request,

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
      } as unknown) as Response,

      (error) => {
        // TODO: Strictly speaking, that error as Error casting is not all
        // correct, but it works, so no need to spend time on it right now.
        if (error) fail(error as Error);
        else done('');
      },
    );
  });

  process.send?.({ markup, status } satisfies ResultT);
}

process.on('message', (message: LaunchT) => {
  void run(message);
});
