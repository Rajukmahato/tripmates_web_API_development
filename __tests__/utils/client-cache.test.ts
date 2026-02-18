import { buildCacheKey, getCached, setCached, removeCached } from '@/app/_utils/client-cache';

describe('client-cache utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-01T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('builds cache key with namespace only', () => {
    expect(buildCacheKey('profile')).toBe('profile');
  });

  it('builds cache key with namespace and userId', () => {
    expect(buildCacheKey('profile', 'u1')).toBe('profile:u1');
  });

  it('builds cache key with namespace, userId and id', () => {
    expect(buildCacheKey('trip', 'u1', 't1')).toBe('trip:u1:t1');
  });

  it('stores and retrieves cached value', () => {
    setCached('k1', { ok: true }, 60_000);
    expect(getCached<{ ok: boolean }>('k1')).toEqual({ ok: true });
  });

  it('returns null for missing cache entry', () => {
    expect(getCached('missing')).toBeNull();
  });

  it('removes expired cache entry', () => {
    setCached('k2', 'value', 1000);
    jest.setSystemTime(new Date('2026-03-01T12:00:02.000Z'));

    expect(getCached('k2')).toBeNull();
    expect(window.localStorage.getItem('tripmates:cache:k2')).toBeNull();
  });

  it('removes invalid cache payload without expiresAt', () => {
    window.localStorage.setItem('tripmates:cache:k3', JSON.stringify({ value: 'x' }));
    expect(getCached('k3')).toBeNull();
    expect(window.localStorage.getItem('tripmates:cache:k3')).toBeNull();
  });

  it('removes malformed json cache payload', () => {
    window.localStorage.setItem('tripmates:cache:k4', '{bad-json');
    expect(getCached('k4')).toBeNull();
    expect(window.localStorage.getItem('tripmates:cache:k4')).toBeNull();
  });

  it('removeCached deletes value by key', () => {
    setCached('k5', 123);
    removeCached('k5');
    expect(getCached('k5')).toBeNull();
  });

  it('setCached ignores localStorage write errors', () => {
    const spy = jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });

    expect(() => setCached('k6', 'value')).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });
});
