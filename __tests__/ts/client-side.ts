/** @jest-environment jsdom */

import mockdate from 'mockdate';
import { mockClientSide } from 'utils/jest';

mockdate.set('2020-04-19Z');

// Mocking getInj() is necessary to successfully load utils/config in
// the mocked client-side environment, without proper server-side data
// injections set up.
jest.mock('client/getInj', () => ({
  default: () => ({
    CONFIG: {
      MOCK_CONFIG_KEY: 'Mock Config Value',
    },
  }),
}));

test('Export at client side', () => {
  mockClientSide();
  const lib = require('../../src');
  expect(lib).toMatchSnapshot();
  expect({ ...lib._ }).toMatchSnapshot();
  expect({ ...lib.api }).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();
});
