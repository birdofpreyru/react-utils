import { time } from '.';

/* Mocking up time.timer(..), because Jest mocks for timers have some issues
 * with timeouts inside promises inside async code, and such complex stuff. */
const timerSpy = jest.spyOn(time, 'timer')
  .mockImplementation(() => Promise.resolve());

jest.useFakeTimers();

const { withRetries } = require('.');

const FAILURE = 'FAILURE';
const SUCCESS = 'SUCCESS';

describe('withRetries(..)', () => {
  function newAsyncTestAction(numFailures = 0) {
    let counter = 0;
    return jest.fn(async () => {
      await time.timer(100);
      if (counter++ < numFailures) throw Error(FAILURE);
      return SUCCESS;
    });
  }

  function newSyncTestAction(numFailures) {
    let counter = 0;
    return jest.fn(() => {
      if (counter++ < numFailures) throw Error(FAILURE);
      return SUCCESS;
    });
  }

  /* eslint-disable no-await-in-loop */
  it('works correctly with async actions', async () => {
    for (let i = 0; i < 4; ++i) {
      timerSpy.mockClear();
      const action = newAsyncTestAction(i);
      await expect(withRetries(action)).resolves.toBe(SUCCESS);
      expect(action).toHaveBeenCalledTimes(i + 1);
      expect(timerSpy.mock.calls).toMatchSnapshot();
    }
    timerSpy.mockClear();
    const action = newAsyncTestAction(5);
    await expect(withRetries(action)).rejects.toThrowErrorMatchingSnapshot();
    expect(action).toHaveBeenCalledTimes(5);
    expect(timerSpy.mock.calls).toMatchSnapshot();
  });

  it('works correctly with sync actions', async () => {
    for (let i = 0; i < 4; ++i) {
      timerSpy.mockClear();
      const action = newSyncTestAction(i);
      await expect(withRetries(action)).resolves.toBe(SUCCESS);
      expect(action).toHaveBeenCalledTimes(i + 1);
      expect(timerSpy.mock.calls).toMatchSnapshot();
    }
    timerSpy.mockClear();
    const action = newSyncTestAction(5);
    await expect(withRetries(action)).rejects.toThrowErrorMatchingSnapshot();
    expect(action).toHaveBeenCalledTimes(5);
    expect(timerSpy.mock.calls).toMatchSnapshot();
  });

  it('respects custom "maxRetries" and "interval" arguments', async () => {
    for (let i = 0; i < 2; ++i) {
      timerSpy.mockClear();
      const action = newAsyncTestAction(i);
      await expect(withRetries(action, 2, 500)).resolves.toBe(SUCCESS);
      expect(action).toHaveBeenCalledTimes(i + 1);
      expect(timerSpy.mock.calls).toMatchSnapshot();
    }
    timerSpy.mockClear();
    const action = newAsyncTestAction(3);
    await expect(withRetries(action, 2, 500))
      .rejects.toThrowErrorMatchingSnapshot();
    expect(action).toHaveBeenCalledTimes(2);
    expect(timerSpy.mock.calls).toMatchSnapshot();
  });
  /* eslint-enable no-await-in-loop */
});
