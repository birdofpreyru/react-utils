/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index",
 *  "typescript": true }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/Scene" }
 */

import { act } from 'react';

import { getGlobal } from 'utils/jest';

const global = getGlobal();

document.write(global.ssrMarkup!);
const container = document.querySelector('#react-view')!;
const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig!.output!.path;

let jsFile: string;
global.webpackStats!.assets!.forEach(({ name }) => {
  if (name.endsWith('.js')) jsFile = name;
});

it('matches SSR render during hydration', async () => {
  const markup = container.innerHTML;
  const js = fs.readFileSync(`${outputPath}/${jsFile}`, 'utf8') as string;
  await act(() => new Function(js)()); // eslint-disable-line no-new-func
  expect(document.querySelector('#react-view')!.innerHTML).toBe(markup);
});
