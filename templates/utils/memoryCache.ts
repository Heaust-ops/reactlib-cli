/**
 * A memory cache that takes care of caching assets that
 * take a while to generate or have high access times
 *
 * This handles getting, setting, generation, pruning and
 * interval pruning
 */
class MemoryCache<T> {
  cache: Record<
    string,
    {
      data: T;
      lastUsed: number;
    }
  >;
  pruneInterval: number | null;
  cleanup: (key: string, data: T) => void;

  constructor(cleanup: (key: string, data: T) => void = () => {}) {
    this.cleanup = cleanup;
    this.pruneInterval = null;
    this.cache = {};
  }

  /**
   * @param key The key to the data
   * @returns The cached data
   */
  public get = (key: string) => {
    if (!this.cache[key]) return undefined;

    this.cache[key].lastUsed = Date.now();
    return this.cache[key].data;
  };

  /**
   * @param key The key to the data
   * @param value The data to cache
   */
  public set = (key: string, value: T) => {
    this.cache[key] = {
      data: value,
      lastUsed: Date.now(),
    };
  };

  public getOrGen = async (key: string, generator: () => Promise<T>) => {
    const item = this.get(key);
    if (item) return item;
    const freshItem = await generator();
    this.set(key, freshItem);
    return freshItem;
  };

  /**
   * @param key The key to the cached data
   * that has to be removed
   */
  public remove = (key: string) => {
    if (!this.cache[key]) return;
    this.cleanup(key, this.cache[key].data);
    delete this.cache[key];
  };

  /**
   * Removes all cached data left unaccessed from before a
   * certain time
   *
   * @param limit The Date before which all items will be removed
   */
  public prune = (limit: number) => {
    for (const key in this.cache) {
      if (this.cache[key].lastUsed < limit) this.remove(key);
    }
  };

  /**
   * This starts an interval that periodically prunes
   * the cache (every some milliseconds)
   *
   * @param period The period to prune on
   */
  public startPruneInterval = (period: number) => {
    this.stopPruneInterval();
    this.pruneInterval = setInterval(
      () => this.prune(Date.now() - period),
      period
    );
  };

  /**
   * This stops the pruning interval if it's engaged
   */
  public stopPruneInterval = () => {
    if (this.pruneInterval) clearInterval(this.pruneInterval);
  };
}

