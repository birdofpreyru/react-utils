/* eslint-disable import/dynamic-import-chunkname, import/no-extraneous-dependencies */

import { resolve } from 'node:path';

import type { Request, Response } from 'express';
import type { ReactNode } from 'react';
import type { Configuration } from 'webpack';

import register from '@babel/register';

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
  register({
    envName: options.babelEnv as string,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
    root,
  });

  if (options.entry) {
    const p = resolve(testFolder, options.entry as string);
    const module = await import(p) as NodeJS.Module;

    const exportName = (options.entryExportName as string) || 'default';
    if (exportName in module) {
      // eslint-disable-next-line no-param-reassign
      options.Application = (
        module as unknown as Record<string, unknown>
      )[exportName] as ReactNode;
    }
  }

  const { default: ssrFactory } = await import('server/renderer');

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
