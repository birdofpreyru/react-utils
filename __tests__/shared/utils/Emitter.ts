import { Emitter } from 'index';

describe('constructor()', () => {
  it('creates a new emitter with empty listeners array', () => {
    const e = new Emitter();
    expect(e.listeners).toStrictEqual([]);
  });
});

describe('.hasListeners', () => {
  it('returns "false" when no listeners connected', () => {
    const e = new Emitter();
    expect(e.hasListeners).toBe(false);
  });

  it('returns "true" when a listener is connected', () => {
    const e = new Emitter();
    e.addListener(() => undefined);
    expect(e.hasListeners).toBe(true);
  });
});

describe('.addListener()', () => {
  it('adds given listeners at most once', () => {
    const e = new Emitter();
    const fnA = jest.fn().mockName('A');
    const fnB = jest.fn().mockName('B');

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnA);

    expect(e.listeners).toMatchSnapshot();

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnA);
    expect(e.listeners).toMatchSnapshot();

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnB);
    expect(e.listeners).toMatchSnapshot();

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnA);
    expect(e.listeners).toMatchSnapshot();
  });

  it('removes functional unsubscribe function', () => {
    const e = new Emitter();
    const fnA = jest.fn().mockName('A');
    const fnB = jest.fn().mockName('B');
    const fnC = jest.fn().mockName('C');

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnA);

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    const unB = e.addListener(fnB);

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    const unC = e.addListener(fnC);
    expect(e.listeners).toMatchSnapshot();
    unB();
    expect(e.listeners).toMatchSnapshot();
    unC();
    expect(e.listeners).toMatchSnapshot();
    unC();
    expect(e.listeners).toMatchSnapshot();
  });
});

describe('.emit()', () => {
  it('calls connected listeners with given arguments', () => {
    const e = new Emitter();
    const fnA = jest.fn().mockName('A');
    const fnB = jest.fn().mockName('B');

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnA);

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnB);
    e.emit('ARG1', 'arg2');
    expect(fnA.mock.calls).toMatchSnapshot();
    expect(fnB.mock.calls).toMatchSnapshot();

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.removeListener(fnA);

    e.emit('second call');
    expect(fnA.mock.calls).toMatchSnapshot();
    expect(fnB.mock.calls).toMatchSnapshot();
  });
});

describe('.removeListener()', () => {
  it('removes given listener if it is connected', () => {
    const e = new Emitter();
    const fnA = jest.fn().mockName('A');
    const fnB = jest.fn().mockName('B');
    const fnC = jest.fn().mockName('C');
    const fnD = jest.fn().mockName('D');

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnA);

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnB);

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnC);

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.addListener(fnD);

    expect(e.listeners).toMatchSnapshot();

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.removeListener(fnA);
    expect(e.listeners).toMatchSnapshot();

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.removeListener(fnC);
    expect(e.listeners).toMatchSnapshot();

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.removeListener(fnA);

    // eslint-disable-next-line @typescript-eslint/strict-void-return
    e.removeListener(fnC);

    expect(e.listeners).toMatchSnapshot();
  });
});
