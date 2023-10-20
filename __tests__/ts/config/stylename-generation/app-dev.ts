/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.js
 * @webpack-config-factory ./config/webpack/app-development.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index.js",
 *  "dontUseHmr": true,
 *  "dontUseReactGlobalStateDebugging": true }
 * @ssr-options { "entry": "./__assets__/Scene.jsx" }
 */

import { act } from 'react-dom/test-utils';

import { global } from 'src/shared/utils/jest/E2eSsrEnv';

document.write(global.ssrMarkup || '');
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
  await act(() => new Function(js)); // eslint-disable-line no-new-func
  expect(document.querySelector('#react-view')?.innerHTML).toBe(markup);
});
