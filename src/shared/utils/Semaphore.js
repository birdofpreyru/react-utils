import { newBarrier } from './Barrier';

/**
 * Implements a simple semaphore for async code logic.
 */
export default class Semaphore {
  #barrier;

  #ready;

  constructor(ready = false) {
    this.#ready = ready;
  }

  get ready() { return this.#ready; }

  setReady(ready) {
    this.#ready = ready;
    if (this.#barrier) {
      this.#barrier.resolve();
      this.#barrier = undefined;
    }
  }

  /**
   * Waits until the semaphore is ready, and marks it as non-ready (seizes it).
   * @return {Promise}
   */
  async seize() {
    await this.waitReady();
    this.setReady(false);
  }

  async waitReady() {
    while (!this.#ready) {
      if (!this.#barrier) this.#barrier = newBarrier();
      await this.#barrier; // eslint-disable-line no-await-in-loop
    }
  }
}
