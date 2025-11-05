/** @jest-environment jsdom */
/* eslint-env browser */

// TODO: Split client- and server-side tests into two separate test modules.

import type ConfigM from 'config';
import { mockClientSide, unmockClientSide } from 'utils/jest';

import type * as ConfigUtilsNS from 'utils/config';

import type * as IT from 'utils/isomorphy';

test('Base test', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const config = require('config') as typeof ConfigM;
  expect(config).toMatchSnapshot();
});

describe('Isomorphy behavior tests', () => {
  const CLIENT_SIDE_CONFIG = {
    TYPE: 'CLIENT_SIDE_CONFIG',
  };

  const SERVER_SIDE_CONFIG = {
    TYPE: 'SERVER_SIDE_CONFIG',
  };

  beforeEach(() => {
    unmockClientSide();
    jest.resetModules();
    jest.setMock('config', { ...SERVER_SIDE_CONFIG });
    // window.CONFIG = clone(CLIENT_SIDE_CONFIG);
  });

  afterEach(() => {
    unmockClientSide();
  });

  // TODO: This test does not work now, as the client-side handles injection
  // of data by server differently, and simply assigning window.CONFIG does not
  // mock it in any way (one of the reason for the change affecting this test
  // was to get rid of objects attached to window by library).
  it.skip('Serves injected config at the client side', () => {
    mockClientSide();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { IS_CLIENT_SIDE } = require('utils/isomorphy') as typeof IT;
    expect(IS_CLIENT_SIDE).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    expect((require('utils/config') as {
      default: typeof ConfigM;
    }).default)
      .toStrictEqual(CLIENT_SIDE_CONFIG);
  });

  it('Serves node-config at the server side', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { IS_SERVER_SIDE } = require('utils/isomorphy') as typeof IT;
    expect(IS_SERVER_SIDE).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getConfig } = require('utils/config') as typeof ConfigUtilsNS;

    expect(getConfig(true)).toStrictEqual(SERVER_SIDE_CONFIG);
  });
});
