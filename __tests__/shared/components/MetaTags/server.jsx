/**
 * Tests for the server-side MetaTags integration.
 */

import supertest from 'supertest';
import { Helmet } from 'react-helmet';

import serverFactory from 'server/server';

import Application, { MODES } from './__assets__/testcase/app';
import Application2, { MODES as MODES2 } from './__assets__/testcase/app2';

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

async function baseTest(Component) {
  const server = supertest(
    await serverFactory(WEBPACK_CONFIG, {
      Application: Component,
      beforeRender: () => ({
        initialState: { domain: 'https://sample.domain' },
      }),
      logger: {
        ...console,
        info: () => null,
      },
    }),
  );
  await server.get('/').expect(200)
    .expect((res) => expect(res.text).toMatchSnapshot());
}

test('Basic tags, no override', () => baseTest(
  () => <Application mode={MODES.BASIC_NO_OVERRIDE} />,
));
test('Basic tags, with override', () => baseTest(
  () => <Application mode={MODES.BASIC_WITH_OVERRIDE} />,
));
test('All tags, with override', () => baseTest(
  () => <Application mode={MODES.ALL_TAGS_WITH_OVERRIDE} />,
));

describe('Using <MetaTags> children feature', () => {
  test('Basic tags, no override', () => baseTest(
    () => <Application2 mode={MODES2.BASIC_NO_OVERRIDE} />,
  ));
  test('Basic tags, with override', () => baseTest(
    () => <Application2 mode={MODES2.BASIC_WITH_OVERRIDE} />,
  ));
});
