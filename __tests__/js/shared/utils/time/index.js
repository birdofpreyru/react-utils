import mockdate from 'mockdate';

const TEST_TIME_MS = 1601937279000;

jest.useFakeTimers();
mockdate.set(TEST_TIME_MS);

const time = require('utils/time').default;

test('Misc aliases', () => {
  expect(time.SEC_MS).toBe(1000);
  expect(time.MIN_MS).toBe(60 * 1000);
  expect(time.HOUR_MS).toBe(60 * 60 * 1000);
  expect(time.DAY_MS).toBe(24 * 60 * 60 * 1000);
  expect(time.YEAR_MS).toBe(365 * 24 * 60 * 60 * 1000);
  expect(time.now()).toBe(TEST_TIME_MS);
});
