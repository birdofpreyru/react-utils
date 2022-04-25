/** @jest-environment jsdom */

import mockdate from 'mockdate';
import { mockClientSide } from 'utils/jest';

mockdate.set('2020-04-19Z');

test('Export at client side', () => {
  mockClientSide();
  const lib = require('../src');
  expect(lib).toMatchSnapshot();
  expect({ ...lib._ }).toMatchSnapshot();
  expect({ ...lib.api }).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();
});
