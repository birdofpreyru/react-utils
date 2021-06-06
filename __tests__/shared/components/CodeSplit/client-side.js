/** @jest-environment jsdom */

import { Helmet } from 'react-helmet';
import mockdate from 'mockdate';
import pretty from 'pretty';

import { act, mockClientSide } from 'utils/jest';

import { renderServerSide } from './__assets__/shared';

jest.mock('node-forge');
jest.mock('uuid');

jest.useFakeTimers();
mockdate.set('2019-11-29Z');

test('Client-side rendering', async () => {
  // Emulates server-sider render to figure out the markup that should be
  // matched at the client-side.

  const { IS_SERVER_SIDE } = require('utils/isomorphy');
  expect(IS_SERVER_SIDE).toBe(true);

  // Forces Helmet to believe it runs server-side.
  Helmet.canUseDOM = false;

  let SampleCodeSplit = require('./__assets__/SampleCodeSplit').default;
  let serverMarkup = renderServerSide(SampleCodeSplit, 3);
  await jest.runAllTimers();
  serverMarkup = await serverMarkup;
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
  act(() => Launch({ getApplication: () => SampleCodeSplit }));
  let head = pretty(document.head.innerHTML);
  let body = pretty(document.body.innerHTML);
  expect(head).toEqual(ssrHead);
  expect(body).toEqual(ssrBody);

  /* This tests that in the real render the data injection script
   * is auto-removed from the document during the injection. */
  jest.resetModules();
  SampleCodeSplit = require('./__assets__/SampleCodeSplit').default;
  document.write(serverMarkup);
  document.close();
  delete window.TRU_KEEP_INJ_SCRIPT;
  require('client/init');
  Launch = require('client').default;
  act(() => Launch({ getApplication: () => SampleCodeSplit }));
  head = pretty(document.head.innerHTML);
  body = pretty(document.body.innerHTML);
  expect(head).toMatchSnapshot();
  expect(body).toMatchSnapshot();
});
