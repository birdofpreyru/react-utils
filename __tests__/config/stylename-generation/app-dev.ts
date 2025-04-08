/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-development.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index.ts",
 *  "dontUseHmr": true,
 *  "dontUseReactGlobalStateDebugging": true,
 *  "typescript": true }
 * @ssr-options { "entry": "./__assets__/Scene.tsx" }
 */

import { act } from 'react';

import { getGlobal } from 'utils/jest';

const global = getGlobal();

document.write(global.ssrMarkup ?? '');
const container = document.querySelector('#react-view');

const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig!.output!.path;

it('emits expected CSS', () => {
  const css = fs?.readFileSync(`${outputPath}/main.css`, 'utf8');
  expect(css).toMatchSnapshot();
});

it('generates expected markup during SSR', () => {
  expect(container?.innerHTML).toMatchSnapshot();
});

it('conserves expected markup after hydration', async () => {
  const markup = container?.innerHTML;
  const js = fs?.readFileSync(`${outputPath}/main.js`, 'utf8') as string;

  // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
  await act(() => new Function(js)());
  expect(document.querySelector('#react-view')?.innerHTML).toBe(markup);
});
