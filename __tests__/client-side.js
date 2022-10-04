/** @jest-environment jsdom */

import mockdate from 'mockdate';
import { mockClientSide } from 'utils/jest';

mockdate.set('2020-04-19Z');

// TODO: This was disabled after upgrade of axios to 1.0.0, as it uses not
// compiled ES imports, and thus requires client side to use webpack build
// environment. However, current implementation of E2eSsrEnv has misc issues
// to make it work: SASS fails if we can't set correct context needed to resolve
// SCSS imports.
test.skip('Export at client side', () => {
  mockClientSide();
  const lib = require('../src');
  expect(lib).toMatchSnapshot();
  expect({ ...lib._ }).toMatchSnapshot();
  expect({ ...lib.api }).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();
});
