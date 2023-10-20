/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index.ts",
 *  "publicPath": "/public-path",
 *  "workbox": true }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "baseAssetsOutputPath": "/public-path",
 *  "entry": "./__assets__/Scene.tsx" }
 */

import { act } from 'react-dom/test-utils';

import { global } from 'utils/jest';

const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig!.output!.path;
const jsPath = global.webpackStats?.assetsByChunkName?.main[0];

document.write(global.ssrMarkup || '');

// Note: the current purpose of this test is to check that custom publicPath
// given in Webpack config correctly applies to the service worker registration.
// More elaborated tests are needed to test other nuances of the service worker.
it('registers service worker with the correct URL', async () => {
  const js = fs?.readFileSync(`${outputPath}/${jsPath}`, 'utf8') as string;

  const register = jest.spyOn(window.navigator.serviceWorker, 'register');

  let onLoad: EventListener | undefined;
  const originalWindowAddEventListener = window.addEventListener;

  jest.spyOn(window, 'addEventListener').mockImplementation((event, callback) => {
    if (event === 'load') onLoad = callback as EventListener;
    originalWindowAddEventListener(event, callback);
  });

  const { log } = console;
  console.log = jest.fn();
  await act(() => new Function(js)); // eslint-disable-line no-new-func
  await act(() => onLoad && onLoad(new Event('load')));
  console.log = log;

  expect(register.mock.calls[0]).toEqual(['/__service-worker.js']);

  // TODO: Test also that the server correctly wires the service worker at root
  // to the actual file in the outputs folder.
});
