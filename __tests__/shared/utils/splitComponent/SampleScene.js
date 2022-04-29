/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.js
 * @webpack-config-factory ./config/webpack/app-development.js
 * @webpack-config-options {
 *  "entry": "./__assets__/SampleScene",
 *  "dontUseHmr": true,
 *  "dontUseReactGlobalStateDebugging": true }
 * @ssr-options { "entry": "./__assets__/SampleScene/SampleScene.jsx" }
 */

import pretty from 'pretty';
import { act } from 'react-dom/test-utils';

const outputPath = global.webpackConfig.output.path;

document.write(global.ssrMarkup);

it('generates expected markup during SSR', () => {
  expect(pretty(document.head.innerHTML)).toMatchSnapshot();

  // This way we don't include into the snapshot the encoded injection
  // string, which change between test runs because the randomly generated
  // key at each launch (could be mocked out, but tnot important for us here).
  const container = document.querySelector('#react-view');
  expect(pretty(container.innerHTML)).toMatchSnapshot();
});

it('hydration works as expected', async () => {
  const headMarkup = document.head.innerHTML;
  const viewMarkup = document.querySelector('#react-view').innerHTML;

  const fs = global.webpackOutputFs;
  const mainJs = fs.readFileSync(`${outputPath}/main.js`, 'utf8');
  const aJs = fs.readFileSync(`${outputPath}/sample-component-a.js`, 'utf8');
  const bJs = fs.readFileSync(`${outputPath}/sample-component-b.js`, 'utf8');
  const cJs = fs.readFileSync(`${outputPath}/sample-component-c.js`, 'utf8');

  await act(new Function(mainJs)); // eslint-disable-line no-new-func
  await act(new Function(aJs)); // eslint-disable-line no-new-func
  await act(new Function(bJs)); // eslint-disable-line no-new-func
  await act(new Function(cJs)); // eslint-disable-line no-new-func

  expect(document.head.innerHTML).toBe(headMarkup);
  expect(document.querySelector('#react-view').innerHTML).toBe(viewMarkup);
});
