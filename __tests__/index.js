import mockdate from 'mockdate';
import { mockClientSide, unmockClientSide } from 'utils/jest';

mockdate.set('2020-04-19Z');

beforeEach(() => {
  unmockClientSide();
  jest.resetModules();
});

test('Export at client side', () => {
  mockClientSide();
  const lib = require('../src');
  expect(lib).toMatchSnapshot();
  expect({ ...lib._ }).toMatchSnapshot();
  expect({ ...lib.api }).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();
});

test('Export at server side', () => {
  const lib = require('../src');
  expect(lib).toMatchSnapshot();
  expect({ ...lib._ }).toMatchSnapshot();
  expect({ ...lib.api }).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();

  Object.entries(lib.server).forEach((item) => expect(item).toMatchSnapshot());
});

test('Lodash alias works', () => {
  const { _ } = require('../src');
  expect(_.upperCase('it works')).toBe('IT WORKS');
});
