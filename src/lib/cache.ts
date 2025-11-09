interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // seconds
}

const CACHE_PREFIX = "lgtm_generator_";

export function setCache<T>(key: string, data: T, ttl: number): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
  };

  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (error) {
    console.warn("Failed to set cache:", error);
  }
}

export function getCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!item) return null;

    const entry: CacheEntry<T> = JSON.parse(item);
    const now = Date.now();
    const age = (now - entry.timestamp) / 1000; // seconds

    if (age > entry.ttl) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.warn("Failed to get cache:", error);
    return null;
  }
}

export function clearExpiredCache(): void {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();

    for (const key of keys) {
      if (!key.startsWith(CACHE_PREFIX)) continue;

      const item = localStorage.getItem(key);
      if (!item) continue;

      try {
        const entry: CacheEntry<unknown> = JSON.parse(item);
        const age = (now - entry.timestamp) / 1000;

        if (age > entry.ttl) {
          localStorage.removeItem(key);
        }
      } catch {
        // Invalid entry, remove it
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.warn("Failed to clear expired cache:", error);
  }
}

export function clearAllCache(): void {
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.warn("Failed to clear all cache:", error);
  }
}
