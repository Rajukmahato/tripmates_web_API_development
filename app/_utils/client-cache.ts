type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const STORAGE_PREFIX = 'tripmates:cache:';

const isBrowser = () => typeof window !== 'undefined';

const buildStorageKey = (key: string) => `${STORAGE_PREFIX}${key}`;

export const buildCacheKey = (namespace: string, userId?: string, id?: string) => {
  if (userId && id) return `${namespace}:${userId}:${id}`;
  if (userId) return `${namespace}:${userId}`;
  return namespace;
};

export const getCached = <T>(key: string): T | null => {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(buildStorageKey(key));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (typeof parsed.expiresAt !== 'number') {
      window.localStorage.removeItem(buildStorageKey(key));
      return null;
    }

    if (Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(buildStorageKey(key));
      return null;
    }

    return parsed.value ?? null;
  } catch {
    window.localStorage.removeItem(buildStorageKey(key));
    return null;
  }
};

export const setCached = <T>(key: string, value: T, ttlMs = 60_000) => {
  if (!isBrowser()) return;

  const entry: CacheEntry<T> = {
    value,
    expiresAt: Date.now() + ttlMs,
  };

  try {
    window.localStorage.setItem(buildStorageKey(key), JSON.stringify(entry));
  } catch {
    // Ignore storage quota issues
  }
};

export const removeCached = (key: string) => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(buildStorageKey(key));
};
