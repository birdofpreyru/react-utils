/*
const mockTimer = jest.fn(() => Promise.resolve());

jest.mock('utils/time', () => ({
  timer: mockTimer,
}));

jest.useFakeTimers();
*/

const { time, withRetries } = require('.');

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
    for (let i = 0; i < 2; ++i) {
      // mockTimer.mockClear();
      const action = newAsyncTestAction(i);
      await expect(withRetries(action)).resolves.toBe(SUCCESS);
      expect(action).toHaveBeenCalledTimes(i + 1);
      // expect(mockTimer.mock.calls).toMatchSnapshot();
    }
    // mockTimer.mockClear();
    const action = newAsyncTestAction(3);
    await expect(withRetries(action)).rejects.toThrowErrorMatchingSnapshot();
    expect(action).toHaveBeenCalledTimes(3);
    // expect(mockTimer.mock.calls).toMatchSnapshot();
  });

  it('works correctly with sync actions', async () => {
    for (let i = 0; i < 2; ++i) {
      // mockTimer.mockClear();
      const action = newSyncTestAction(i);
      await expect(withRetries(action)).resolves.toBe(SUCCESS);
      expect(action).toHaveBeenCalledTimes(i + 1);
      // expect(mockTimer.mock.calls).toMatchSnapshot();
    }
    // mockTimer.mockClear();
    const action = newSyncTestAction(3);
    await expect(withRetries(action)).rejects.toThrowErrorMatchingSnapshot();
    expect(action).toHaveBeenCalledTimes(3);
    // expect(mockTimer.mock.calls).toMatchSnapshot();
  });

  it('respects custom "maxRetries" and "interval" arguments', async () => {
    for (let i = 0; i < 2; ++i) {
      // mockTimer.mockClear();
      const action = newAsyncTestAction(i);
      await expect(withRetries(action, 2, 10)).resolves.toBe(SUCCESS);
      expect(action).toHaveBeenCalledTimes(i + 1);
      // expect(mockTimer.mock.calls).toMatchSnapshot();
    }
    // mockTimer.mockClear();
    const action = newAsyncTestAction(6);
    await expect(withRetries(action, 5, 10))
      .rejects.toThrowErrorMatchingSnapshot();
    expect(action).toHaveBeenCalledTimes(5);
    // expect(mockTimer.mock.calls).toMatchSnapshot();
  });
  /* eslint-enable no-await-in-loop */
});
