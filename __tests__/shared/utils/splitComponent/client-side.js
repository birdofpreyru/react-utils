/** @jest-environment jsdom */

import fs from 'fs';

import { Helmet } from 'react-helmet';
import mockdate from 'mockdate';
import pretty from 'pretty';

import { act, mockClientSide } from 'utils/jest';

jest.mock('node-forge');
jest.mock('uuid');

mockdate.set('2019-11-29Z');

// Note: this will do as a simplistic polyfill for setImmediate(),
// which otherwise is not available in Jest's JSDom environment,
// but is necessary for us in this test as we need to run SSR
// alongside the client-side testing.
global.setImmediate = setTimeout;

// The SSR markup is loaded from the server-side test snapshot.
const serverTestSnapshots = require('./__snapshots__/server-side.js.snap');

const SSR_TEST_NAME = 'Server-side rendering 1';

// Goofy way to deserialize Jest snapshot, but it works for us for now.
const serverMarkup = serverTestSnapshots[SSR_TEST_NAME]
  .slice(2, -2)
  .replaceAll('\\"', '"');

// Note: this must match the mock file in ./__assets__/test_data/.build-info
// Because the JSDom environment, it is far easier to copy/paste the file,
// rather than dynamically load it (I guess, fs is not available)
window.TRU_BUILD_INFO = JSON.parse(
  fs.readFileSync(`${__dirname}/__assets__/test_data/.build-info`, 'utf8'),
);

test('The loaded server markup has not changed', () => {
  expect(serverMarkup).toMatchSnapshot();
});

test('Client-side rendering', async () => {
  // Forces Helmet to believe it runs server-side.
  let SampleCodeSplit = require('./__assets__/SampleCodeSplit').default;
  document.open();
  document.write(serverMarkup);
  document.close();
  const ssrHead = pretty(document.head.innerHTML);
  const ssrBody = pretty(document.body.innerHTML);
  expect(ssrHead).toMatchSnapshot();
  expect(ssrBody).toMatchSnapshot();

  // Forces Helmet to believe it runs client-side.
  Helmet.canUseDOM = true;

  // Environment reset to client-side emulation, and the actual test.

  jest.resetModules();
  mockClientSide();
  window.TRU_KEEP_INJ_SCRIPT = true;
  SampleCodeSplit = require('./__assets__/SampleCodeSplit').default;

  require('client/init');

  const { IS_CLIENT_SIDE } = require('utils/isomorphy');
  expect(IS_CLIENT_SIDE).toBe(true);

  let Launch = require('client').default;
  act(() => Launch(SampleCodeSplit, { hydrate: true }));
  let head = pretty(document.head.innerHTML);
  let body = pretty(document.body.innerHTML);
  expect(head).toEqual(ssrHead);
  expect(body).toEqual(ssrBody);

  /* This tests that in the real render the data injection script
   * is auto-removed from the document during the injection. */
  jest.resetModules();
  SampleCodeSplit = require('./__assets__/SampleCodeSplit').default;
  document.open();
  document.write(serverMarkup);
  document.close();
  delete window.TRU_KEEP_INJ_SCRIPT;
  require('client/init');
  Launch = require('client').default;
  act(() => Launch(SampleCodeSplit, { hydrate: true }));
  head = pretty(document.head.innerHTML);
  body = pretty(document.body.innerHTML);
  expect(head).toMatchSnapshot();
  expect(body).toMatchSnapshot();
});
