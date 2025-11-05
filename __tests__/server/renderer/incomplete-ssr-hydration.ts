/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/incomplete-ssr-hydration/index",
 *  "typescript": true }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/incomplete-ssr-hydration/Scene",
 *  "maxSsrRounds": 1 }
 */

import { act } from 'react';

import { timer } from '@dr.pogodin/js-utils';

import { getGlobal } from 'utils/jest';

function noop() {
  // NOOP
}

const global = getGlobal();

document.write(global.ssrMarkup ?? '');
const markup = document.querySelector('#react-view')?.innerHTML;

const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig!.output!.path;
const jsFilename = global.webpackStats
  ?.namedChunkGroups?.main?.assets?.[0]?.name;

it('generates expected SSR markup', () => {
  expect(markup).toMatchSnapshot();
});

it('hydrates successfully', async () => {
  console.error = noop;
  const js = fs.readFileSync(`${outputPath}/${jsFilename}`, 'utf8') as string;

  await act(async () => {
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    new Function(js)();
    await timer(100);
  });

  const container = document.querySelector('#react-view');
  expect(container?.innerHTML).toBe(markup);
});
