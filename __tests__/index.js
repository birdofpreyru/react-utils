/* global window */

jest.mock('utils/webpack/require');

beforeEach(() => jest.resetModules());

afterEach(() => delete window.TRU_FRONT_END);

test('Export at client side', () => {
  window.TRU_FRONT_END = true;
  const lib = require('../src');
  expect(lib).toMatchSnapshot();
  expect(Object.keys(lib._)).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();
});

test('Export at server side', () => {
  const lib = require('../src');
  expect(lib).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();
});
