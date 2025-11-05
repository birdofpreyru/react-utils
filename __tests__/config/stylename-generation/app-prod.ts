/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index.ts",
 *  "typescript": true }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/Scene.tsx" }
 */

import { act } from 'react';

import { timer } from '@dr.pogodin/js-utils';

import { getGlobal } from 'utils/jest';

const global = getGlobal();

document.write(global.ssrMarkup ?? '');
const container = document.querySelector('#react-view');

const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig!.output!.path;

let jsFile: string | undefined;
let cssFile: string | undefined;
global.webpackStats?.assets?.forEach(({ name }) => {
  if (name.endsWith('.css')) cssFile = name;
  else if (name.endsWith('.js')) jsFile = name;
});

it('emits expected number of assets', () => {
  expect(global.webpackStats?.assets?.length).toBe(2);
});

it('emits expected CSS', () => {
  const css = fs.readFileSync(`${outputPath}/${cssFile}`, 'utf8');
  expect(css).toMatchSnapshot();
});

it('generates expected markup during SSR', () => {
  expect(container?.innerHTML).toMatchSnapshot();
});

it('conserves expected markup after hydration', async () => {
  const markup = container?.innerHTML;
  const js = fs.readFileSync(`${outputPath}/${jsFile}`, 'utf8') as string;

  await act(async () => {
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    new Function(js)();
    await timer(100);
  });

  expect(document.querySelector('#react-view')?.innerHTML).toBe(markup);
});
