type CachedItemT<DatumT> = {
  data: DatumT;
  size: number;
  timestamp: number;
};

/**
 * Implements the static cache.
 */
export default class Cache<DatumT> {
  private items: Record<string, CachedItemT<DatumT>> = {};

  private size = 0;

  constructor(private maxSize: number) { }

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
    const item = this.items[key];
    return item && Date.now() - item.timestamp < maxage ? item.data : null;
  }

  /**
   * Adds item to cache.
   * @param data Item to add.
   * @param key Key to store the item at.
   * @param size Byte size of the item.
   */
  add(data: DatumT, key: string, size: number): void {
    const cached = this.items[key];
    if (cached) this.size -= cached.size;

    this.items[key] = { data, size, timestamp: Date.now() };
    this.size += size;

    if (this.size > this.maxSize) {
      const entries = Object.entries(this.items);
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      for (const entry of entries) {
        const [itemKey, item] = entry;
        delete this.items[itemKey];
        this.size -= item.size;
        if (this.size < this.maxSize / 2) break;
      }
    }
  }
}
