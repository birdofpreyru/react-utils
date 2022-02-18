import Semaphore from 'utils/Semaphore';

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
  let sem;
  let signals;

  beforeEach(() => {
    sem = new Semaphore();
    signals = [];
  });

  test('.waitReady() can be used as a simple barrier', async () => {
    const newFlow = async (signal) => {
      await sem.waitReady();
      signals.push(signal);
    };
    const flows = [newFlow('A'), newFlow('B')];
    sem.setReady(true);
    await Promise.all(flows);
    expect(sem.ready).toBe(true);
    expect(signals).toEqual(['A', 'B']);
  });

  test('.waitReady() can be used for mutual exclusion', async () => {
    const newFlow = async (signal) => {
      await sem.waitReady();
      sem.setReady(false);
      signals.push(signal);
    };
    const flows = [newFlow('A'), newFlow('B')];
    sem.setReady(true);
    await Promise.race(flows);
    expect(sem.ready).toBe(false);
    expect(signals).toEqual(['A']);
    sem.setReady(true);
    await Promise.all(flows);
    expect(sem.ready).toBe(false);
    expect(signals).toEqual(['A', 'B']);
  });

  it('.seize() can be used for mutual exclusion', async () => {
    const newFlow = async (signal) => {
      await sem.seize();
      signals.push(signal);
    };
    const flows = [newFlow('A'), newFlow('B')];
    sem.setReady(true);
    await Promise.race(flows);
    expect(sem.ready).toBe(false);
    expect(signals).toEqual(['A']);
    sem.setReady(true);
    await Promise.all(flows);
    expect(sem.ready).toBe(false);
    expect(signals).toEqual(['A', 'B']);
  });
});
