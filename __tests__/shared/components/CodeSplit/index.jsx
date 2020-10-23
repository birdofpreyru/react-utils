/**
 * Here are the actual code splitting tests.
 */

import _ from 'lodash';
import mockdate from 'mockdate';
import pretty from 'pretty';

import { act, mockClientSide, unmockClientSide } from 'utils/jest';

let factory;
let Helmet;
let SampleCodeSplit;

jest.mock('node-forge');
jest.mock('uuid');

jest.useFakeTimers();
mockdate.set('2019-11-29Z');

const TEST_HTTP_REQUEST = {
  cspNonce: 'abcdef-dummy-nonce',
  info: 'I am a dummy HTTP request! No need for a complex mock here!',
};

const TEST_WEBPACK_CONFIG = {
  context: `${__dirname}/test_data`,
  output: {
    path: '/test/path',
    publicPath: '/test/public/path/',
  },
};

/**
 * Reproduces the core of server-side rendering setup.
 * @param {Object} Scene
 * @param {Number} [maxSsrRounds]
 */
async function renderServerSide(Scene, maxSsrRounds) {
  const { IS_SERVER_SIDE } = require('utils/isomorphy');
  expect(IS_SERVER_SIDE).toBe(true);
  const renderer = factory(
    _.cloneDeep(TEST_WEBPACK_CONFIG),
    {
      Application: Scene,
      maxSsrRounds,
    },
  );
  let render = '';
  await renderer(
    _.cloneDeep(TEST_HTTP_REQUEST),
    {
      locals: {
        webpackStats: {
          toJson: () => ({
            assetsByChunkName: {
              main: [
                'main-1511941200000.css',
                'main-1511941200000.js',
              ],
              polyfills: [
                'polyfills-1511941200000.js',
              ],
              'test-chunk-a': [
                'test-chunk-a-1511941200000.css',
              ],
              'test-chunk-b': [
                'test-chunk-b-1511941200000.js',
                'test-chunk-b-1511941200000.css',
              ],
            },
          }),
        },
      },
      send: (x) => { render += x; },
      status: (x) => { render += `HTTP STATUS: ${x}\n`; },
    },
    (error) => expect(error).toMatchSnapshot(),
  );
  return render;
}

afterAll(() => {
  Helmet.canUseDOM = true;
});

/**
 * Resets React environment.
 */
function resetModules(clientSide) {
  if (clientSide) mockClientSide();
  else unmockClientSide();
  jest.resetModules();
  factory = require('server/renderer').default;
  ({ Helmet } = require('react-helmet'));
  Helmet.canUseDOM = false;
  SampleCodeSplit = require(
    'components/CodeSplit/__mocks__/SampleCodeSplit',
  ).default;
}

beforeEach(async () => {
  resetModules();
});

test('Server-side rendring', async () => {
  const { IS_SERVER_SIDE } = require('utils/isomorphy');
  expect(IS_SERVER_SIDE).toBe(true);
  let markup = await renderServerSide(SampleCodeSplit, 1);
  expect(pretty(markup)).toMatchSnapshot();
  markup = renderServerSide(SampleCodeSplit, 3);
  jest.runAllTimers();
  markup = await markup;
  expect(pretty(markup)).toMatchSnapshot();
});

test('Client-side rendering', async () => {
  const { IS_SERVER_SIDE } = require('utils/isomorphy');
  expect(IS_SERVER_SIDE).toBe(true);
  let serverMarkup = renderServerSide(SampleCodeSplit, 3);
  await jest.runAllTimers();
  serverMarkup = await serverMarkup;
  document.write(serverMarkup);
  document.close();
  const ssrHead = pretty(document.head.innerHTML);
  const ssrBody = pretty(document.body.innerHTML);
  expect(ssrHead).toMatchSnapshot();
  expect(ssrBody).toMatchSnapshot();
  window.TRU_KEEP_INJ_SCRIPT = true;
  require('client/init');
  resetModules(true);
  const { IS_CLIENT_SIDE } = require('utils/isomorphy');
  expect(IS_CLIENT_SIDE).toBe(true);
  let Launch = require('client').default;
  await act(() => Launch({ getApplication: () => SampleCodeSplit }));
  let head = pretty(document.head.innerHTML);
  let body = pretty(document.body.innerHTML);
  expect(head).toEqual(ssrHead);
  expect(body).toEqual(ssrBody);

  /* This tests that in the real render the data injection script
   * is auto-removed from the document during the injection. */
  resetModules(true);
  document.write(serverMarkup);
  document.close();
  delete window.TRU_KEEP_INJ_SCRIPT;
  require('client/init');
  Launch = require('client').default;
  await act(() => Launch({ getApplication: () => SampleCodeSplit }));
  head = pretty(document.head.innerHTML);
  body = pretty(document.body.innerHTML);
  expect(head).toMatchSnapshot();
  expect(body).toMatchSnapshot();
});
