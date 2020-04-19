import mockdate from 'mockdate';

mockdate.set('2020-04-19Z');

beforeEach(() => jest.resetModules());

afterEach(() => delete window.TRU_FRONT_END);

test.only('Export at client side', () => {
  window.TRU_FRONT_END = true;
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
});
