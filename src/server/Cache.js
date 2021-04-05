/**
 * Implements the static cache.
 */
export default class Cache {
  constructor(maxSize) {
    this.private = {
      items: {},
      maxSize,
      size: 0,
    };
  }

  /**
   * Cache lookup.
   * @param {string} key Item key to look for.
   * @param {number} [maxage=Number.MAX_VALUE] Optional. The maximum age of
   *  cached item to serve. Default to infinite.
   * @returns {string} Cached item, or null if the item is absent in cache,
   *  or stale.
   */
  get({ key, maxage = Number.MAX_VALUE }) {
    const item = this.private.items[key];
    return item && Date.now() - item.timestamp < maxage ? item.data : null;
  }

  /**
   * Adds item to cache.
   * @param {string} data Item to add.
   * @param {string} key Key to store the item at.
   */
  add(data, key) {
    const p = this.private;
    const old = p.items[key];
    if (old) p.size -= old.data.length;
    p.items[key] = { data, timestamp: Date.now() };
    p.size += data.length;
    if (p.size > p.maxSize) {
      const items = Object.entries(p.items);
      items.sort((a, b) => a[1].timestamp - b[1].timestamp);
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        delete p.items[item[0]];
        p.size -= item[1].data.length;
        if (p.size < p.maxSize / 2) break;
      }
    }
  }
}
