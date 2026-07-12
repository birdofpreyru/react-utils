/** @jest-environment jsdom */

import mockdate from 'mockdate';

import { expect, jest, test } from '@jest/globals';

import type * as GetInJM from 'client/getInj';
import { mockClientSide } from 'utils/jest';

mockdate.set('2020-04-19Z');

function mockGetInj() {
  return {
    CONFIG: {
      MOCK_CONFIG_KEY: 'Mock Config Value',
    },
  };
}

// Mocking getInj() is necessary to successfully load utils/config in
// the mocked client-side environment, without proper server-side data
// injections set up.
jest.unstable_mockModule<typeof GetInJM>('../src/client/getInj', () => ({
  default: mockGetInj,
}));

test('Export at client side', async () => {
  mockClientSide();
  const lib = await import('../src');
  expect(lib).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();
});
