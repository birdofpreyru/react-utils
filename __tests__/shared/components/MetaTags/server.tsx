/**
 * Tests for the server-side MetaTags integration.
 */

import type { ComponentType } from 'react';
import supertest from 'supertest';

import {
  afterEach,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import type * as ServerM from 'server/server';

import { setBuildInfo } from 'utils/isomorphy/buildInfo';

// eslint-disable-next-line jest/no-mocks-import
import * as mockCrypto from '../../../../__mocks__/crypto';

import Application, { MODES } from './__assets__/testcase/app';
import Application2, { MODES as MODES2 } from './__assets__/testcase/app2';

jest.unstable_mockModule('node:crypto', () => mockCrypto);

let serverFactory: typeof ServerM.default;

beforeAll(async () => {
  serverFactory = (await import('server/server')).default;
});

const WEBPACK_CONFIG = {
  context: `${import.meta.dirname}/__assets__/testcase`,
  output: {
    path: '/path/to/assets',
    publicPath: '/test/public/path',
  },
};

function noop() {
  // NOOP
}

async function baseTest(Component: ComponentType) {
  const server = supertest(
    await serverFactory(WEBPACK_CONFIG, {
      Application: Component,
      beforeRender: () => ({
        initialState: { domain: 'https://sample.domain' },
      }),
      logger: {
        debug: noop,
        error: noop,
        info: noop,
        log: noop,
        warn: noop,
      },
      maxSsrRounds: 3,
      ssrTimeout: Number.MAX_VALUE,
    }),
  );
  await server.get('/').expect(200)
    .expect((res) => {
      expect(res.text).toMatchSnapshot();
    });
}

afterEach(() => {
  setBuildInfo(undefined, true);
});

test('Basic tags, no override', async () => baseTest(
  () => <Application mode={MODES.BASIC_NO_OVERRIDE} />,
));

test('Basic tags, with override', async () => baseTest(
  () => <Application mode={MODES.BASIC_WITH_OVERRIDE} />,
));

test('All tags, with override', async () => baseTest(
  () => <Application mode={MODES.ALL_TAGS_WITH_OVERRIDE} />,
));

describe('Using <MetaTags> children feature', () => {
  test('Basic tags, no override', async () => baseTest(
    () => <Application2 mode={MODES2.BASIC_NO_OVERRIDE} />,
  ));

  test('Basic tags, with override', async () => baseTest(
    () => <Application2 mode={MODES2.BASIC_WITH_OVERRIDE} />,
  ));
});
