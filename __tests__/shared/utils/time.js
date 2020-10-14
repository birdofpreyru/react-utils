import mockdate from 'mockdate';

jest.useFakeTimers();

let time;

const TEST_TIME_MS = 1601937279000;
beforeAll(() => {
  mockdate.set(TEST_TIME_MS);
  time = require('utils/time').default;
});

test('Misc aliases', () => {
  expect(time.SEC_MS).toBe(1000);
  expect(time.MIN_MS).toBe(60 * 1000);
  expect(time.HOUR_MS).toBe(60 * 60 * 1000);
  expect(time.DAY_MS).toBe(24 * 60 * 60 * 1000);
  expect(time.YEAR_MS).toBe(365 * 24 * 60 * 60 * 1000);
  expect(time.now()).toBe(TEST_TIME_MS);
});

test('time.timer()', (done) => {
  let timer = time.timer(time.SEC_MS).then(() => { timer = null; });
  jest.advanceTimersByTime(time.SEC_MS - 1);
  setImmediate(() => {
    expect(timer).toBeTruthy();
    jest.advanceTimersByTime(1);
  });
  setImmediate(() => {
    expect(timer).toBe(null);
    done();
  });
});
