/**
 * Barrier is just a Promise which has resolve and reject exposed as instance
 * methods.
 */
export class Barrier extends Promise {
  #resolve;

  #resolved = false;

  #reject;

  #rejected = false;

  constructor(executor) {
    let resolveRef;
    let rejectRef;
    super((resolve, reject) => {
      resolveRef = (value) => {
        resolve(value);
        this.#resolved = true;
      };
      rejectRef = (error) => {
        reject(error);
        this.#rejected = true;
      };
      if (executor) executor(resolveRef, rejectRef);
    });
    this.#resolve = resolveRef;
    this.#reject = rejectRef;
  }

  get resolve() { return this.#resolve; }

  get resolved() { return this.#resolved; }

  get reject() { return this.#reject; }

  get rejected() { return this.#rejected; }

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
