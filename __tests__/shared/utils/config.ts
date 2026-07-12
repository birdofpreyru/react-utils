/** @jest-environment jsdom */

// TODO: Split client- and server-side tests into two separate test modules.

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  test,
} from '@jest/globals';

import { mockClientSide, unmockClientSide } from 'utils/jest';

test('Base test', async () => {
  const config = await import('config');
  expect(config.util.toObject(config)).toMatchSnapshot();
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
  it.skip('Serves injected config at the client side', async () => {
    mockClientSide();
    const { IS_CLIENT_SIDE } = await import('utils/isomorphy');
    expect(IS_CLIENT_SIDE).toBe(true);
    await expect(import('utils/config'))
      .resolves.toStrictEqual(CLIENT_SIDE_CONFIG);
  });

  it('Serves node-config at the server side', async () => {
    const { IS_SERVER_SIDE } = await import('utils/isomorphy');
    expect(IS_SERVER_SIDE).toBe(true);
    const { getConfig } = await import('utils/config');

    expect(getConfig(true)).toStrictEqual(SERVER_SIDE_CONFIG);
  });
});
