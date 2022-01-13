/**
 * Barrier is just a Promise which has resolve and reject exposed as instance
 * methods.
 */
export class Barrier extends Promise {
  #resolve;

  #reject;

  constructor(executor) {
    let resolveRef;
    let rejectRef;
    super((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
      if (executor) executor(resolve, reject);
    });
    this.#resolve = resolveRef;
    this.#reject = rejectRef;
  }

  get resolve() { return this.#resolve; }

  get reject() { return this.#reject; }

  then(onFulfilled, onRejected) {
    const res = super.then(onFulfilled, onRejected);
    res.#resolve = this.#resolve;
    res.#reject = this.#reject;
    return res;
  }
}

/**
 * Creates a new Barrier.
 * @returns {Barrier}
 */
export function newBarrier(executor) {
  return new Barrier(executor);
}
