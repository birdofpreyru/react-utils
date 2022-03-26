import { Barrier } from 'utils/Barrier';

describe('Base usage', () => {
  it('.resolved and .rejected are "false" initially', () => {
    const barrier = new Barrier();
    expect(barrier.rejected).toBe(false);
    expect(barrier.resolved).toBe(false);
  });

  it('resolves', async () => {
    const barrier = new Barrier();
    barrier.resolve('OK');
    expect(barrier.rejected).toBe(false);
    expect(barrier.resolved).toBe(true);
    await expect(barrier).resolves.toBe('OK');
  });

  it('rejects', async () => {
    const barrier = new Barrier();
    barrier.reject('OK');
    expect(barrier.rejected).toBe(true);
    expect(barrier.resolved).toBe(false);
    await expect(barrier).rejects.toBe('OK');
  });
});

describe('.then()', () => {
  it('resolves if called after the barrier resolution', async () => {
    const barrier = new Barrier();
    barrier.resolve('NO');
    await expect(barrier.then(() => 'OK')).resolves.toBe('OK');
  });

  it('resolves if used before the barrier resolution', async () => {
    const barrier = new Barrier();
    const test = expect(barrier.then(() => 'OK')).resolves.toBe('OK');
    barrier.resolve('NO');
    await test;
  });

  it('returns a barrier reusing the same resolve/reject', async () => {
    const barrier = (new Barrier()).then(() => 'OK');
    barrier.resolve('NO');
    await expect(barrier).resolves.toBe('OK');
  });
});

describe('.catch()', () => {
  it('rejects correctly when chained', async () => {
    // eslint-disable-next-line no-throw-literal
    const barrier = (new Barrier()).catch(() => { throw 'ERROR'; });
    barrier.reject('OGH');
    await expect(barrier).rejects.toBe('ERROR');
  });
});

describe('.finally()', () => {
  it('works as expected when chained (I)', async () => {
    // eslint-disable-next-line no-throw-literal
    const barrier = (new Barrier()).finally(() => { throw 'ERROR'; });
    barrier.resolve('OK');
    await expect(barrier).rejects.toBe('ERROR');
  });

  it('works as expected when chained (II)', async () => {
    // eslint-disable-next-line no-throw-literal
    const barrier = (new Barrier()).finally(() => { throw 'ERROR'; });
    barrier.reject('OGH');
    await expect(barrier).rejects.toBe('ERROR');
  });
});
