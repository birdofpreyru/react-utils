import { clone } from 'lodash';
import supertest from 'supertest';

import serverFactory from 'server/server';

// Test logger, which omits regular info message from the console.
const logger = {
  ...console,
  info: () => null,
};

jest.mock('serve-favicon', () => jest.fn(() => (req, res, next) => next()));

jest.mock('webpack', () => {
  const mock = () => ({
    apply: jest.fn(),
    plugin: jest.fn(),
    watch: jest.fn(),
  });
  mock.ProgressPlugin = Object;
  return mock;
});

jest.mock(
  'webpack-hot-middleware',
  () => jest.fn(() => (req, res, next) => next()),
);

const TEST_CONTEXT = `${__dirname}/test_data`;

const TEST_FAVICON_PATH = '/path/to/favicon.ico';

const TEST_WEBPACK_CONFIG = {
  context: TEST_CONTEXT,
  output: {
    path: '/path/to/assets',
    publicPath: '/test/public/path/',
  },
};

afterEach(() => {
  delete process.env.DEV_TOOLS;
  jest.resetAllMocks();
});

test('Favicon support', () => {
  const server = serverFactory(TEST_WEBPACK_CONFIG, {
    favicon: clone(TEST_FAVICON_PATH),
    logger,
  });
  expect(require('serve-favicon')).toHaveBeenCalledWith(TEST_FAVICON_PATH);
  return server;
});

test('Launch with dev tools', () => {
  process.env.DEV_TOOLS = true;
  const server = serverFactory(TEST_WEBPACK_CONFIG, { logger: console });
  return server;
});

describe('Server is functional', () => {
  let server;

  beforeAll(async () => {
    server = supertest(
      await serverFactory(TEST_WEBPACK_CONFIG, {
        Application: () => <div>Hello World!</div>,
        cspSettingsHook: (csp) => {
          csp.directives['default-src'].push('https://sample.url');
          return csp;
        },
        logger,
        maxSsrRounds: 3,

        // Use cache in tests as well.
        staticCacheController: () => 'key',
      }),
    );
  });

  test('Simple request', async () => {
    await server.get('/').expect(200)
      .expect((res) => {
        expect(res.headers['content-security-policy']).toMatchSnapshot();
        expect(res.text).toMatchSnapshot();
      });
  });
});
