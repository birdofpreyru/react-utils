// The code needed both for server and client-side tests.

import { cloneDeep, noop } from 'lodash';
import factory from 'server/renderer';

const TEST_HTTP_REQUEST = {
  nonce: 'abcdef-dummy-nonce',
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
 * @param {object} Scene
 * @param {object} [options]
 * @param {number} [options.maxSsrRounds]
 * @param {string} [options.url]
 */
export async function renderServerSide(Scene, {
  maxSsrRounds,
  url,
} = {}) {
  const { IS_SERVER_SIDE } = require('utils/isomorphy');
  expect(IS_SERVER_SIDE).toBe(true);
  const renderer = factory(
    cloneDeep(TEST_WEBPACK_CONFIG),
    {
      Application: Scene,
      maxSsrRounds,
      ssrTimeout: 1000,
    },
  );
  let render = '';
  await renderer(
    {
      ...TEST_HTTP_REQUEST,
      url: url || '/',
    },
    {
      locals: {
        webpack: {
          // TODO: Rather than mocking the middleware, use it, to safeguard
          // against any breaking changes in future middleware releases.
          devMiddleware: {
            stats: {
              toJson: () => ({
                namedChunkGroups: {
                  main: {
                    assets: [
                      { name: 'main-1511941200000.css' },
                      { name: 'main-1511941200000.js' },
                    ],
                  },
                  'sample-component-1': {
                    assets: [{ name: 'sample-component-1-1511941200000.css' }],
                  },
                  'sample-component-2': {
                    assets: [
                      { name: 'sample-component-2-1511941200000.js' },
                      { name: 'sample-component-2-1511941200000.css' },
                    ],
                  },
                  'sample-component-3': {
                    assets: [
                      { name: 'sample-component-3-1511941200000.js' },
                      { name: 'sample-component-3-1511941200000.css' },
                    ],
                  },
                },
              }),
            },
          },
        },
      },
      send: (x) => { render += x; },
      set: noop,
      status: (x) => { render += `HTTP STATUS: ${x}\n`; },
    },
    (error) => expect(error).toMatchSnapshot(),
  );
  return render;
}

export default undefined;
