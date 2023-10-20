import { type Request, type Response, type NextFunction } from 'express';
import { clone, noop } from 'lodash';
import supertest from 'supertest';

import serverFactory, { type CspOptionsT } from 'server/server';
import { setBuildInfo } from 'utils/isomorphy/buildInfo';

// Test logger, which omits regular info message from the console.
const logger = {
  debug: noop,
  error: noop,
  info: noop,
  log: noop,
  warn: noop,
};

jest.mock('serve-favicon', () => jest.fn(
  () => (req: Request, res: Response, next: NextFunction) => next()
));

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
  () => jest.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
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
  setBuildInfo(undefined, true);
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
  process.env.DEV_TOOLS = '1';
  const server = serverFactory(TEST_WEBPACK_CONFIG, { logger });
  return server;
});

describe('Server is functional', () => {
  let server: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    server = supertest(
      await serverFactory(TEST_WEBPACK_CONFIG, {
        Application: () => <div>Hello World!</div>,
        cspSettingsHook: (csp: CspOptionsT) => {
          const sources = csp.directives?.['default-src'] as Array<string>;
          sources.push('https://sample.url');
          return csp;
        },
        logger,
        maxSsrRounds: 3,

        // Use cache in tests as well.
        staticCacheController: () => ({ key: 'key' }),
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
