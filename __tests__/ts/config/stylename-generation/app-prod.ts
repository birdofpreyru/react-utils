/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.js
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options { "entry": "./__assets__/index.js" }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/Scene.jsx" }
 */

import { act } from 'react-dom/test-utils';

import { global } from 'src/shared/utils/jest/E2eSsrEnv';

document.write(global.ssrMarkup || '');
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
  const css = fs?.readFileSync(`${outputPath}/${cssFile}`, 'utf8');
  expect(css).toMatchSnapshot();
});

it('generates expected markup during SSR', () => {
  expect(container?.innerHTML).toMatchSnapshot();
});

it('conserves expected markup after hydration', async () => {
  const markup = container?.innerHTML;
  const js = fs?.readFileSync(`${outputPath}/${jsFile}`, 'utf8') as string;
  await act(() => new Function(js)); // eslint-disable-line no-new-func
  expect(document.querySelector('#react-view')?.innerHTML).toBe(markup);
});
