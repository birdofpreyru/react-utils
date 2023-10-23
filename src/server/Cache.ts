/**
 * Implements the static cache.
 */
export default class Cache<DatumT> {
  private: {
    items: {
      [key: string]: {
        data: DatumT;
        size: number;
        timestamp: number;
      }
    };
    maxSize: number;
    size: number;
  };

  constructor(maxSize: number) {
    this.private = {
      items: {},
      maxSize,
      size: 0,
    };
  }

  /**
   * Cache lookup.
   * @param key Item key to look for.
   * @param [maxage=Number.MAX_VALUE] Optional. The maximum age of
   *  cached item to serve. Default to infinite.
   * @returns Cached item, or null if the item is absent in cache,
   *  or stale.
   */
  get({
    key,
    maxage = Number.MAX_VALUE,
  }: {
    key: string;
    maxage?: number;
  }): DatumT | null {
    const item = this.private.items[key];
    return item && Date.now() - item.timestamp < maxage ? item.data : null;
  }

  /**
   * Adds item to cache.
   * @ignore
   * @param data Item to add.
   * @param key Key to store the item at.
   * @param size Byte size of the item.
   */
  add(data: DatumT, key: string, size: number) {
    const p = this.private;
    const old = p.items[key];
    if (old) p.size -= old.size;
    p.items[key] = { data, size, timestamp: Date.now() };
    p.size += size;
    if (p.size > p.maxSize) {
      const items = Object.entries(p.items);
      items.sort((a, b) => a[1].timestamp - b[1].timestamp);
      for (let i = 0; i < items.length; ++i) {
        const [itemKey, item] = items[i];
        delete p.items[itemKey];
        p.size -= item.size;
        if (p.size < p.maxSize / 2) break;
      }
    }
  }
}
