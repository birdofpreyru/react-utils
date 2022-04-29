/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.js
 * @webpack-config-factory ./config/webpack/app-development.js
 * @webpack-config-options {
 *  "entry": "./__assets__/RoutingScene",
 *  "dontUseHmr": true,
 *  "dontUseReactGlobalStateDebugging": true }
 * @ssr-options {
 *  "entry": "./__assets__/RoutingScene/RoutingScene.jsx",
 *  "entryExportName": "RoutingScene1" }
 * @ssr-request { "url": "/base/hello-world" }
 */

import pretty from 'pretty';
import { act } from 'react-dom/test-utils';

const outputPath = global.webpackConfig.output.path;

document.write(global.ssrMarkup);

it('generates expected markup during SSR', () => {
  expect(pretty(document.head.innerHTML)).toMatchSnapshot();
  const container = document.querySelector('#react-view');
  expect(pretty(container.innerHTML)).toMatchSnapshot();
});

it('hydration works as expected', async () => {
  const headMarkup = document.head.innerHTML;
  const viewMarkup = document.querySelector('#react-view').innerHTML;

  const fs = global.webpackOutputFs;
  const mainJs = fs.readFileSync(`${outputPath}/main.js`, 'utf8');
  const splitJs = fs.readFileSync(`${outputPath}/split.js`, 'utf8');

  /*
  global.testEnv.reconfigure({
    url: '/base',
  });
  */
  // console.log(global.testEnv);

  await act(new Function(mainJs)); // eslint-disable-line no-new-func
  await act(new Function(splitJs)); // eslint-disable-line no-new-func

  expect(document.head.innerHTML).toBe(headMarkup);
  expect(document.querySelector('#react-view').innerHTML).toBe(viewMarkup);
});
