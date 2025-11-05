/**
 * @jest-environment ./src/shared/utils/jest/E2eSsrEnv.ts
 * @webpack-config-factory ./config/webpack/app-production.js
 * @webpack-config-options {
 *  "entry": "./__assets__/index.ts",
 *  "workbox": true,
 *  "typescript": true }
 * @ssr-options {
 *  "babelEnv": "production",
 *  "entry": "./__assets__/Scene.tsx" }
 */

import { act } from 'react';

import { timer } from '@dr.pogodin/js-utils';

import { getGlobal } from 'utils/jest';

const global = getGlobal();

const fs = global.webpackOutputFs;
const outputPath = global.webpackConfig!.output!.path;
const jsPath = global.webpackStats?.assetsByChunkName?.main?.[0];

document.write(global.ssrMarkup ?? '');

// Note: the current purpose of this test is to check that custom publicPath
// given in Webpack config correctly applies to the service worker registration.
// More elaborated tests are needed to test other nuances of the service worker.
it('registers service worker with the correct URL', async () => {
  const js = fs.readFileSync(`${outputPath}/${jsPath}`, 'utf8') as string;

  const nav = window.navigator;
  // @ts-expect-error Cannot assign to 'serviceWorker' because it is a read-only property.
  nav.serviceWorker = { register: jest.fn() };
  window.navigator = nav;

  let onLoad: EventListener | undefined;
  const originalWindowAddEventListener = window.addEventListener;

  jest.spyOn(window, 'addEventListener').mockImplementation((event, callback) => {
    // eslint-disable-next-line jest/no-conditional-in-test
    if (event === 'load') onLoad = callback as EventListener;
    originalWindowAddEventListener(event, callback);
  });

  const { log } = console;
  // eslint-disable-next-line jest/prefer-spy-on
  console.log = jest.fn();

  await act(async () => {
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    new Function(js)();
    await timer(100);
  });

  act(() => {
    // eslint-disable-next-line jest/no-conditional-in-test
    if (onLoad) onLoad(new Event('load'));
  });

  console.log = log;

  // @ts-expect-error Property 'mock' does not exist on type '(scriptURL: string | URL, options?: RegistrationOptions | undefined) => Promise<ServiceWorkerRegistration>'.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(nav.serviceWorker.register.mock.calls[0]).toStrictEqual(['/__service-worker.js']);
});
