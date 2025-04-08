/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/client.tsx",
 *  "typescript": true }
 * @ssr-options { "entry": "./__assets__/Scene.tsx" }
 */

import { act } from 'react';

import { getGlobal } from 'utils/jest';

const global = getGlobal();

const outputPath = global.webpackConfig!.output!.path;

let container: HTMLElement | null;

beforeEach(() => {
  // Resets the document with SSR markup.
  document.open();
  document.write(global.ssrMarkup ?? '');
  document.close();

  // Assigns react container node to "container".
  container = document.querySelector('#react-view');
});

it('generates expected markup during SSR', () => {
  expect(container?.innerHTML).toMatchSnapshot();
});

it('emits the PNG file to the expected path', () => {
  const path = container?.innerHTML?.match(/src="(.*\.png)"/)?.[1];
  expect(global.webpackOutputFs?.existsSync(`${outputPath}/${path}`)).toBe(true);
});

it('generates expected markup at the client-side', async () => {
  const ssrMarkup = container?.innerHTML;
  let js = global.webpackStats?.entrypoints?.main?.assets?.[0]?.name;
  js = global.webpackOutputFs?.readFileSync(`${outputPath}/${js}`, 'utf8') as string;

  // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  await act(() => new Function(js || '')());

  expect(container?.innerHTML).toBe(ssrMarkup);
});
