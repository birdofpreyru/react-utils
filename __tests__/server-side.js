import mockdate from 'mockdate';

mockdate.set('2020-04-19Z');

test('Export at server side', () => {
  const lib = require('../src');
  expect(lib).toMatchSnapshot();
  expect({ ...lib._ }).toMatchSnapshot();
  expect({ ...lib.api }).toMatchSnapshot();
  expect(Object.keys(lib.time)).toMatchSnapshot();

  Object.entries(lib.server).forEach((item) => expect(item).toMatchSnapshot());
});
