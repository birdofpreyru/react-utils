/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index.js",
 *  "workbox": true,
 *  "typescript": true }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/Scene.jsx" }
 */

import { act } from 'react';

const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig.output.path;
const jsPath = global.webpackStats.assetsByChunkName.main[0];

document.write(global.ssrMarkup);

// Note: the current purpose of this test is to check that custom publicPath
// given in Webpack config correctly applies to the service worker registration.
// More elaborated tests are needed to test other nuances of the service worker.
it('registers service worker with the correct URL', async () => {
  const js = fs.readFileSync(`${outputPath}/${jsPath}`, 'utf8');
  const register = jest.fn();
  window.navigator.serviceWorker = { register };
  let onLoad;
  const originalWindowAddEventListener = window.addEventListener;
  window.addEventListener = (event, callback) => {
    if (event === 'load') onLoad = callback;
    originalWindowAddEventListener(event, callback);
  };

  const { log } = console;
  console.log = jest.fn();
  await act(new Function(js)); // eslint-disable-line no-new-func
  await act(onLoad);
  console.log = log;

  expect(register.mock.calls[0]).toEqual(['/__service-worker.js']);
});
