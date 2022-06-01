/* eslint-disable no-await-in-loop */

import Semaphore from 'utils/Semaphore';
import { timer } from 'utils/time';

describe('constructor', () => {
  it('creates non-ready semaphore by default', () => {
    const sem = new Semaphore();
    expect(sem.ready).toBe(false);
  });

  it('creates ready semaphore, when opted', () => {
    const sem = new Semaphore(true);
    expect(sem.ready).toBe(true);
  });

  it('casts constructor argument to boolean', () => {
    const sem = new Semaphore('TRUE');
    expect(sem.ready).toBe(true);
  });
});

describe('concurrent use', () => {
  test('.waitReady() can be used as a simple barrier', async () => {
    let flag = false;
    const sem = new Semaphore();

    (async () => {
      await sem.waitReady();
      flag = true;
    })();

    await timer(10);
    expect(flag).toBe(false);
    sem.setReady(true);
    await timer(10);
    expect(flag).toBe(true);
  });

  test('.waitReady() can be used for mutual exclusion', async () => {
    const dT = 30;
    const signals = [];
    const sem = new Semaphore();

    const newFlow = async (signal) => {
      for (let i = 1; i <= 2; ++i) {
        await sem.waitReady();
        sem.setReady(false);
        signals.push(`${signal}-${i}`);
        await timer(dT);
        sem.setReady(true);
      }
    };

    newFlow('A');
    newFlow('B');

    expect(signals).toEqual([]);
    sem.setReady(true);
    await timer(dT / 2);
    expect(signals).toEqual(['A-1']);
    await timer(dT);
    expect(signals).toEqual(['A-1', 'B-1']);
    await timer(dT);
    expect(signals).toEqual(['A-1', 'B-1', 'A-2']);
    await timer(dT);
    expect(signals).toEqual(['A-1', 'B-1', 'A-2', 'B-2']);
  });

  test('.seize() can be used for mutual exclusion', async () => {
    const dT = 30;
    const signals = [];
    const sem = new Semaphore();

    const newFlow = async (signal) => {
      for (let i = 1; i <= 2; ++i) {
        await sem.seize();
        signals.push(`${signal}-${i}`);
        await timer(dT);
        sem.setReady(true);
      }
    };

    newFlow('A');
    newFlow('B');

    expect(signals).toEqual([]);
    sem.setReady(true);
    await timer(dT / 2);
    expect(signals).toEqual(['A-1']);
    await timer(dT);
    expect(signals).toEqual(['A-1', 'B-1']);
    await timer(dT);
    expect(signals).toEqual(['A-1', 'B-1', 'A-2']);
    await timer(dT);
    expect(signals).toEqual(['A-1', 'B-1', 'A-2', 'B-2']);
  });

  test(
    '.waitReady() does not skip the drain queue when the semaphore is ready',
    async () => {
      const signals = [];
      const sem = new Semaphore();
      const newFlow = async (signal) => {
        await sem.waitReady();
        signals.push(signal);
      };
      newFlow('A');
      newFlow('B');
      sem.setReady(true);
      newFlow('C');
      await timer(10);
      expect(signals).toEqual(['A', 'B', 'C']);
    },
  );
});
