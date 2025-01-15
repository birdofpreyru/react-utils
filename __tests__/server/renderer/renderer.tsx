import { type Request, type RequestHandler } from 'express';
import { cloneDeep, noop } from 'lodash';
import factory, { SCRIPT_LOCATIONS, isBrotliAcceptable } from 'server/renderer';
import fs from 'fs';

import serializeJs from 'serialize-javascript';

import {
  type ForceT,
  getGlobalState,
  useGlobalState,
} from '@dr.pogodin/react-global-state';

import { Helmet, HelmetProvider } from 'react-helmet-async';

import { type Configuration } from 'webpack';

import { getSsrContext } from 'utils/globalState';

import { getBuildInfo, setBuildInfo } from 'utils/isomorphy/buildInfo';

import {
  mockHttpRequest,
  mockHttpResponse,
  mockWebpackConfig,
} from './__assets__/common';

declare module global {
  let mockFailsForgeRandomGetBytesMethod: boolean | undefined;
}

global.mockFailsForgeRandomGetBytesMethod = false;

jest.mock('node-forge');

const TEST_CONTEXT = `${__dirname}/__assets__`;

const TEST_INITIAL_STATE = {
  stateKey1: 'State Value #1',
  stateKey2: 'State Value #2',
};

const testBuildInfo = JSON.parse(
  fs.readFileSync(`${TEST_CONTEXT}/.build-info`, 'utf8'),
);

beforeAll(() => {
  HelmetProvider.canUseDOM = false;
});

afterEach(() => {
  // TODO: It will be better to completely re-load tested modules, and thus not
  // having to reset this manually.
  setBuildInfo(undefined, true);

  global.mockFailsForgeRandomGetBytesMethod = false;
});

afterAll(() => {
  HelmetProvider.canUseDOM = true;
});

// TODO: Can we update this test to generate the webpack stats and attach
// them to locals by the actual run of webpack-dev-middleware, thus allowing
// to catch any issues caused by breaking changes in the middleware?
/**
 * Performs tests with the specified configuration and options.
 * @param {Object} webpackConfig
 * @param {Object} options
 * @return {Promise}
 */
async function coreTest(webpackConfig: Configuration, options = {}) {
  expect(getBuildInfo).toThrowErrorMatchingSnapshot();

  let renderer: RequestHandler | undefined;
  expect(() => {
    renderer = factory(webpackConfig, {
      ...options,
      logger: {
        debug: noop,
        error: noop,
        info: noop,
        log: noop,
        warn: noop,
      },
    });
  }).not.toThrow();
  expect(renderer).toBeInstanceOf(Function);
  expect(getBuildInfo()).toEqual(testBuildInfo);

  try {
    const { render, res } = mockHttpResponse();
    if (renderer) {
      await renderer(
        (mockHttpRequest() as unknown) as Request,
        res,
        (error) => expect(error).toMatchSnapshot(),
      );
    }
    expect(render.markup).toMatchSnapshot();
    expect(render.status).toMatchSnapshot();
  } catch (e) {
    expect(e).toMatchSnapshot();
  }
}

test(
  'Base rendering of HTML template',
  () => coreTest(mockWebpackConfig(), {}),
);

test(
  '"favicon" option',
  () => coreTest(mockWebpackConfig(), { favicon: '/path/to/favicon.ico' }),
);

test(
  'Config overriding for injection',
  () => coreTest(mockWebpackConfig(), {
    beforeRender: async (req: Request, sanitizedConfig: any) => {
      expect(sanitizedConfig).toBeInstanceOf(Object);
      expect(sanitizedConfig).not.toHaveProperty('SECRET');
      return {
        configToInject: {
          ...sanitizedConfig,
          additionalKey: 'Additional Value',
        },
      };
    },
  }),
);

test('JS constructs in global state', () => {
  const Component = () => {
    // TODO: Could use State type, but not a big deal for now.
    useGlobalState<ForceT, string>('test.1', 'defaultValue');
    useGlobalState<ForceT, Set<number>>('set', new Set([1, 2]));
    const state = getGlobalState().get();
    return <div>{serializeJs(state)}</div>;
  };
  return coreTest(mockWebpackConfig(), {
    Application: Component,
    maxSsrRounds: 3,
  });
});

test(
  'Helmet integration works',
  () => coreTest(mockWebpackConfig(), {
    Application: () => (
      <div>
        <p>
          Hello World!
        </p>
        <Helmet>
          <title>
            Test Page Title
          </title>
          <meta property="description" content="Test Page Description" />
        </Helmet>
        <p>
          Goodbye World!
        </p>
      </div>
    ),
    maxSsrRounds: 3,
    ssrTimeout: Number.MAX_VALUE,
  }),
);

test(
  'Injection of additional JS scripts',
  () => coreTest(mockWebpackConfig(), {
    beforeRender: async () => ({
      extraScripts: [
        '<script>Dummy JS Sript</script>',
        '<script>Another Dummy JS Script</script>', {
          code: '<script>Yet another Dummy JS Script</script>',
          location: SCRIPT_LOCATIONS.DEFAULT,
        }, {
          code: '<script>1-st script after opening <head></script>',
          location: SCRIPT_LOCATIONS.HEAD_OPEN,
        }, {
          code: '<script>1-st script after opening <body></script>',
          location: SCRIPT_LOCATIONS.BODY_OPEN,
        }, {
          code: '<script>2-nd script after opening <body></script>',
          location: SCRIPT_LOCATIONS.BODY_OPEN,
        }, {
          code: '<script>2-nd script after opening <head></script>',
          location: SCRIPT_LOCATIONS.HEAD_OPEN,
        },
      ],
    }),
  }),
);

test(
  'Server-side rendering (SSR); injection of CSS chunks & Redux state',
  () => coreTest(mockWebpackConfig(), {
    Application: () => {
      const context = getSsrContext()!;
      context.chunks.push('test-chunk-a');
      context.chunks.push('test-chunk-b');
      return <div>Hello Wold!</div>;
    },
    beforeRender: async () => ({
      initialState: cloneDeep(TEST_INITIAL_STATE),
    }),
    maxSsrRounds: 3,
    ssrTimeout: Number.MAX_VALUE,
  }),
);

test(
  'Setting of response HTTP status the server-side rendering',
  () => coreTest(mockWebpackConfig(), {
    Application: () => {
      const context = getSsrContext()!;
      context.status = 404; // eslint-disable-line no-param-reassign
      return <div>404 Error Test</div>;
    },
    maxSsrRounds: 3,
    ssrTimeout: Number.MAX_VALUE,
  }),
);

test('Throws in case of forge.random.getBytes(..) failure', () => {
  global.mockFailsForgeRandomGetBytesMethod = true;
  return coreTest(mockWebpackConfig(), {});
});

it('correctly tests if brotli-encoded responses are acceptable', () => {
  const res = (header: string) => isBrotliAcceptable({
    get: (name: string) => (name.toLowerCase() === 'accept-encoding'
      ? header : undefined),
  } as Request);
  expect(res('')).toBe(false);
  expect(res('*')).toBe(true);
  expect(res('br')).toBe(true);
  expect(res('gzip')).toBe(false);
  expect(res('gzip,br')).toBe(true);
  expect(res('gzip, br')).toBe(true);
  expect(res('gzip,br,deflate')).toBe(true);
  expect(res('gzip, br ,deflate')).toBe(true);
  expect(res('gzip,br;q=0.5,deflate')).toBe(true);
  expect(res('gzip,br;q=0.0,deflate')).toBe(false);
  expect(res('gzip,br;q=0,deflate')).toBe(false);
  expect(res('gzip, br;q=0 ,deflate')).toBe(false);
  expect(res('*;q=0')).toBe(false);
  expect(res('br;q=0,*;q=0.5')).toBe(true);
});
