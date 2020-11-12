/**
 * Tests for the server-side MetaTags integration.
 */

import supertest from 'supertest';
import { Helmet } from 'react-helmet';

import serverFactory from 'server/server';

import Application, { MODES } from './__assets__/testcase/app';

// Without this setting the JSDom presence in test environment tricks
// tricks react-helmet to think it is executed client-side.
Helmet.canUseDOM = false;

const WEBPACK_CONFIG = {
  context: `${__dirname}/__assets__/testcase`,
  output: {
    path: '/path/to/assets',
    publicPath: '/test/public/path',
  },
};

async function baseTest(mode) {
  const server = supertest(
    await serverFactory(WEBPACK_CONFIG, {
      Application: () => <Application mode={mode} />,
      beforeRender: () => ({
        initialState: { domain: 'https://sample.domain' },
      }),
      logger: console,
    }),
  );
  await server.get('/').expect(200)
    .expect((res) => expect(res.text).toMatchSnapshot());
}

test('Basic tags, no override', () => baseTest(MODES.BASIC_NO_OVERRIDE));
test('Basic tags, with override', () => baseTest(MODES.BASIC_WITH_OVERRIDE));
test('All tags, with override', () => baseTest(MODES.ALL_TAGS_WITH_OVERRIDE));
