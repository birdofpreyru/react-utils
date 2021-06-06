/** @jest-environment jsdom */
/* eslint-env browser */

// TODO: Split client- and server-side tests into two separate test modules.

import _ from 'lodash';
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
    jest.setMock('config', _.clone(SERVER_SIDE_CONFIG));
    window.CONFIG = _.clone(CLIENT_SIDE_CONFIG);
  });

  afterEach(() => unmockClientSide());

  test('Serves injected config at the client side', () => {
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
