import { newBarrier } from './Barrier';

/**
 * Implements a simple semaphore for async code logic.
 */
export default class Semaphore {
  constructor(ready = false) {
    this.#ready = !!ready;
  }

  get ready() { return this.#ready; }

  setReady(ready) {
    const bool = !!ready;
    if (this.#ready !== bool) {
      this.#ready = bool;
      if (bool && !this.#draining) this.#drainQueue();
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
    if (!this.#ready || this.#queue.length) {
      const barrier = newBarrier();
      this.#queue.push(barrier);
      await barrier;
    }
  }

  // Private members below this point.

  /**
   * If semaphore is ready, it releases the next barrier in the queue, if any,
   * and reschedules itself for a call in the next event loop iteration.
   * Otherwise, it breaks the queue draining loop, which will be restarted
   * the next time the semaphore is set ready.
   */
  #drainQueue() {
    if (this.#ready && this.#queue.length) {
      const next = this.#queue.shift();
      next.resolve();

      // Re-schedules itself for the next event loop iteration.
      if (this.#queue.length) {
        setTimeout(this.#drainQueue.bind(this));
        this.#draining = true;
        return; // Exit here to avoid the drain loop termination below.
      }
    }

    // Cleans up for the drain loop termination.
    this.#draining = false;
  }

  // "true" when the drain queue process is running (and thus no need to start
  // a new one).
  #draining = false;

  // The array of barriers set for each async code flow awaiting for
  // the Semaphore to become ready.
  #queue = [];

  #ready;
}
