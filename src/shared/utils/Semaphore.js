import { Barrier } from './Barrier';

/**
 * Implements a simple semaphore for async code logic.
 */
export default class Semaphore {
  constructor(ready) {
    this.#ready = !!ready;
  }

  get ready() { return this.#ready; }

  setReady(ready) {
    const bool = !!ready;
    if (this.#ready !== bool) {
      this.#ready = bool;
      if (bool && !this.#draining && this.#queue.length) this.#drainQueue();
    }
  }

  /**
   * Waits until the semaphore is ready, and marks it as non-ready (seizes it).
   * @return {Promise}
   */
  async seize() {
    return this.waitReady(true);
  }

  async waitReady(seize = false) {
    if (!this.#ready || this.#queue.length) {
      const barrier = new Barrier();
      this.#queue.push(barrier);
      await barrier;
      if (seize) this.#ready = false;
      this.#drainLock.resolve();
    } else if (seize) this.#ready = false;
  }

  // Private members below this point.

  /**
   * If semaphore is ready, it releases the next barrier in the queue, if any,
   * and reschedules itself for a call in the next event loop iteration.
   * Otherwise, it breaks the queue draining loop, which will be restarted
   * the next time the semaphore is set ready.
   */
  async #drainQueue() {
    this.#draining = true;
    while (this.#ready && this.#queue.length) {
      this.#drainLock = new Barrier();
      this.#queue[0].resolve();
      await this.#drainLock; // eslint-disable-line no-await-in-loop
      this.#queue.shift();
    }
    this.#draining = false;
    this.#drainLock = null;
  }

  // "true" when the drain queue process is running (and thus no need to start
  // a new one).
  #draining = false;

  // Each time a Promise from drain queue is resolved this drainLock is set
  // to block further queue draining until the promise resolution handler
  // (.seize() or .waitReady()) unlocks it, thus confirming it is fine
  // to continue the draining. This is specifically important for .seize(),
  // which should have a chance to switch semaphore state to non-ready prior
  // to next Promise in the queue being unlocked.
  #drainLock = null;

  // The array of barriers set for each async code flow awaiting for
  // the Semaphore to become ready.
  #queue = [];

  #ready;
}
