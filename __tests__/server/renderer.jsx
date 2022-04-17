import { clone, cloneDeep, noop } from 'lodash';
import factory, { SCRIPT_LOCATIONS, isBrotliAcceptable } from 'server/renderer';
import fs from 'fs';

import serializeJs from 'serialize-javascript';

import {
  getGlobalState,
  getSsrContext,
  GlobalStateProvider,
  useGlobalState,
} from '@dr.pogodin/react-global-state';

import { Helmet } from 'react-helmet';

global.mockFailsForgeRandomGetBytesMethod = false;

jest.mock('node-forge');

const TEST_CONTEXT = `${__dirname}/test_data`;

const TEST_INITIAL_STATE = {
  stateKey1: 'State Value #1',
  stateKey2: 'State Value #2',
};

const TEST_HTTP_REQUEST = {
  nonce: 'abcdef-dummy-nonce',
  info: 'I am a dummy HTTP request! No need for a complex mock here!',
};

const TEST_WEBPACK_CONFIG = {
  context: TEST_CONTEXT,
  output: {
    path: '/test/path',
    publicPath: '/test/public/path/',
  },
};

const testBuildInfo = JSON.parse(
  fs.readFileSync(`${TEST_CONTEXT}/.build-info`),
);

beforeAll(() => {
  Helmet.canUseDOM = false;
});

afterEach(() => {
  delete global.TRU_BUILD_INFO;
  global.mockFailsForgeRandomGetBytesMethod = false;
});

afterAll(() => {
  Helmet.canUseDOM = true;
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
async function coreTest(webpackConfig, options) {
  expect(global.TRU_BUILD_INFO).toBeUndefined();

  let renderer;
  expect(() => {
    renderer = factory(webpackConfig, options);
  }).not.toThrow();
  expect(renderer).toBeInstanceOf(Function);
  expect(global.TRU_BUILD_INFO).toEqual(testBuildInfo);

  try {
    let render = '';
    await renderer(
      clone(TEST_HTTP_REQUEST),
      {
        locals: {
          webpack: {
            devMiddleware: {
              stats: {
                toJson: () => ({
                  // Note: asset names here do not match the currently
                  // used naming
                  // template [contenthash].xxx, but older name template
                  // [chunkname]-[buildTimestamp].xxx The actual names are not
                  // important for the test, and using older names allows to
                  // check there is no actual change in the code logic.
                  namedChunkGroups: {
                    main: {
                      assets: [
                        { name: 'main-1511941200000.css' },
                        { name: 'main-1511941200000.js' },
                      ],
                    },
                    'test-chunk-a': {
                      assets: [{ name: 'test-chunk-a-1511941200000.css' }],
                    },
                    'test-chunk-b': {
                      assets: [
                        { name: 'test-chunk-b-1511941200000.js' },
                        { name: 'test-chunk-b-1511941200000.css' },
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
    expect(render).toMatchSnapshot();
  } catch (e) {
    expect(e).toMatchSnapshot();
  }
}

test(
  'Base rendering of HTML template',
  () => coreTest(TEST_WEBPACK_CONFIG, {}),
);

test(
  '"favicon" option',
  () => coreTest(TEST_WEBPACK_CONFIG, { favicon: '/path/to/favicon.ico' }),
);

test(
  'Config overriding for injection',
  () => coreTest(TEST_WEBPACK_CONFIG, {
    beforeRender: async (res, sanitizedConfig) => {
      expect(res).toEqual(TEST_HTTP_REQUEST);
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
  function Component() {
    useGlobalState('test.1', 'defaultValue');
    useGlobalState('set', new Set([1, 2]));
    const { state } = getGlobalState();
    return <div>{serializeJs(state)}</div>;
  }
  return coreTest(TEST_WEBPACK_CONFIG, {
    Application: () => (
      <GlobalStateProvider>
        <Component />
      </GlobalStateProvider>
    ),
    maxSsrRounds: 3,
  });
});

test(
  'Helmet integration works',
  () => coreTest(TEST_WEBPACK_CONFIG, {
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
  () => coreTest(TEST_WEBPACK_CONFIG, {
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
  () => coreTest(TEST_WEBPACK_CONFIG, {
    Application: () => {
      const context = getSsrContext();
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
  () => coreTest(TEST_WEBPACK_CONFIG, {
    Application: () => {
      const context = getSsrContext();
      context.status = 404; // eslint-disable-line no-param-reassign
      return <div>404 Error Test</div>;
    },
    maxSsrRounds: 3,
    ssrTimeout: Number.MAX_VALUE,
  }),
);

test('Throws in case of forge.random.getBytes(..) failure', () => {
  global.mockFailsForgeRandomGetBytesMethod = true;
  return coreTest(TEST_WEBPACK_CONFIG, {});
});

it('correctly tests if brotli-encoded responses are acceptable', () => {
  const res = (header) => isBrotliAcceptable({
    get: (name) => (name.toLowerCase() === 'accept-encoding'
      ? header : undefined),
  });
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
