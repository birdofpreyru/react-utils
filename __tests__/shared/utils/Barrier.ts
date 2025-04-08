import { Barrier } from 'utils';

describe('Base usage', () => {
  it('.resolved and .rejected are "false" initially', () => {
    const barrier = new Barrier();
    expect(barrier.rejected).toBe(false);
    expect(barrier.resolved).toBe(false);
  });

  it('resolves', async () => {
    const barrier = new Barrier();
    void barrier.resolve('OK');
    expect(barrier.rejected).toBe(false);
    expect(barrier.resolved).toBe(true);
    await expect(barrier).resolves.toBe('OK');
  });

  it('rejects', async () => {
    const barrier = new Barrier();
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    void barrier.reject('OK');
    expect(barrier.rejected).toBe(true);
    expect(barrier.resolved).toBe(false);
    await expect(barrier).rejects.toBe('OK');
  });
});

describe('.then()', () => {
  it('resolves if called after the barrier resolution', async () => {
    const barrier = new Barrier();
    void barrier.resolve('NO');
    await expect(barrier.then(() => 'OK')).resolves.toBe('OK');
  });

  it('resolves if used before the barrier resolution', async () => {
    const barrier = new Barrier();
    // eslint-disable-next-line jest/valid-expect
    const test = expect(barrier.then(() => 'OK')).resolves.toBe('OK');
    void barrier.resolve('NO');
    await test;
  });

  it('returns a barrier reusing the same resolve/reject', async () => {
    const barrier = new Barrier().then(() => 'OK');
    expect(barrier instanceof Barrier).toBe(true);
    void barrier.resolve('NO');
    await expect(barrier).resolves.toBe('OK');
    expect(barrier.resolved).toBe(true);
    expect(barrier.rejected).toBe(false);
  });
});

describe('.catch()', () => {
  it('rejects correctly when chained', async () => {
    const barrier = new Barrier().catch(() => {
      throw 'ERROR'; // eslint-disable-line @typescript-eslint/only-throw-error
    });
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    void barrier.reject('OGH');
    await expect(barrier).rejects.toBe('ERROR');
  });
});

describe('.finally()', () => {
  it('works as expected when chained (I)', async () => {
    const barrier = new Barrier().finally(() => {
      throw 'ERROR'; // eslint-disable-line @typescript-eslint/only-throw-error
    });
    void barrier.resolve('OK');
    await expect(barrier).rejects.toBe('ERROR');
  });

  it('works as expected when chained (II)', async () => {
    const barrier = new Barrier().finally(() => {
      throw 'ERROR'; // eslint-disable-line @typescript-eslint/only-throw-error
    });
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    void barrier.reject('OGH');
    await expect(barrier).rejects.toBe('ERROR');
  });
});
