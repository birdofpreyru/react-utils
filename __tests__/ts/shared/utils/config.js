/** @jest-environment jsdom */
/* eslint-env browser */

// TODO: Split client- and server-side tests into two separate test modules.

import { clone } from 'lodash';
import { mockClientSide, unmockClientSide } from 'utils/jest';

test('Base test', () => {
  const config = require('config');
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
    jest.setMock('config', clone(SERVER_SIDE_CONFIG));
    // window.CONFIG = clone(CLIENT_SIDE_CONFIG);
  });

  afterEach(() => unmockClientSide());

  // TODO: This test does not work now, as the client-side handles injection
  // of data by server differently, and simply assigning window.CONFIG does not
  // mock it in any way (one of the reason for the change affecting this test
  // was to get rid of objects attached to window by library).
  test.skip('Serves injected config at the client side', () => {
    mockClientSide();
    const { IS_CLIENT_SIDE } = require('utils/isomorphy');
    expect(IS_CLIENT_SIDE).toBe(true);
    expect(require('utils/config').default).toEqual(CLIENT_SIDE_CONFIG);
  });

  test('Serves node-config at the server side', () => {
    const { IS_SERVER_SIDE } = require('utils/isomorphy');
    expect(IS_SERVER_SIDE).toBe(true);
    expect(require('utils/config').default).toEqual(SERVER_SIDE_CONFIG);
  });
});
