import type { NextFunction, Request, Response } from 'express';

import type ServeFaviconM from 'serve-favicon';
import supertest from 'supertest';
import type WebpackM from 'webpack';
import type WebpackHotM from 'webpack-hot-middleware';

import serverFactory, { type CspOptionsT } from 'server/server';
import { setBuildInfo } from 'utils/isomorphy/buildInfo';

function noop() {
  // NOOP
}

// Test logger, which omits regular info message from the console.
const logger = {
  debug: noop,
  error: noop,
  info: noop,
  log: noop,
  warn: noop,
};

jest.mock<typeof ServeFaviconM>('serve-favicon', () => jest.fn(
  () => (req: Request, res: Response, next: NextFunction) => {
    next();
  },
));

jest.mock<typeof WebpackM>('webpack', () => {
  const mock = () => ({
    apply: jest.fn(),
    plugin: jest.fn(),
    watch: jest.fn(),
  });
  mock.ProgressPlugin = Object;
  return mock as unknown as typeof WebpackM;
});

jest.mock<typeof WebpackHotM>(
  'webpack-hot-middleware',
  () => jest.fn(
    () => (req: Request, res: Response, next: NextFunction) => {
      next();
    },
  ) as unknown as typeof WebpackHotM,
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

test('Favicon support', async () => {
  const server = serverFactory(TEST_WEBPACK_CONFIG, {
    favicon: TEST_FAVICON_PATH,
    logger,
  });
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  expect(require('serve-favicon')).toHaveBeenCalledWith(TEST_FAVICON_PATH);
  await server;
});

test('Launch with dev tools', async () => {
  process.env.DEV_TOOLS = '1';
  const server = serverFactory(TEST_WEBPACK_CONFIG, { logger });
  await server;
});

describe('Server is functional', () => {
  let server: supertest.Agent;

  beforeAll(async () => {
    server = supertest(
      await serverFactory(TEST_WEBPACK_CONFIG, {
        Application: () => <div>Hello World!</div>,
        cspSettingsHook: (csp: CspOptionsT) => {
          const sources = csp.directives?.['default-src'] as string[];
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
