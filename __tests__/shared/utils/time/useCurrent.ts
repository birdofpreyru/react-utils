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

test('matches SSR render during hydration', async () => {
  const markup = container.innerHTML;
  const js = fs.readFileSync(`${outputPath}/${jsFile}`, 'utf8') as string;

  // TODO: Rewise, if this can be simplified.
  // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
  await act(() => new Function(js)());
  expect(document.querySelector('#react-view')!.innerHTML).toBe(markup);
});
