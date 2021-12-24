/**
 * Simple listeneable data Emitter.
 */
export default class Emitter {
  /**
   * Creates a new Emitter.
   */
  constructor() {
    this.listeners = [];
  }

  /**
   * Returns "true" if any listener is connected; "false" otherwise.
   * @return {boolean}
   */
  get hasListeners() {
    return !!this.listeners.length;
  }

  /**
   * Adds `listener` if it is not already connected.
   * @param {function} listener
   * @return {function} Unsubscribe function.
   */
  addListener(listener) {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
    return () => this.removeListener(listener);
  }

  /**
   * Calls every connected listener with the given arguments.
   * @param  {...any} args
   */
  emit(...args) {
    const { listeners } = this;
    for (let i = 0; i < listeners.length; ++i) {
      listeners[i](...args);
    }
  }

  /**
   * Removes specified `listener`, if connected.
   * @param {function} listener
   */
  removeListener(listener) {
    const idx = this.listeners.indexOf(listener);
    if (idx >= 0) this.listeners.splice(idx, 1);
  }
}
