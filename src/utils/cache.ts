import { Env } from '../types';
import { CACHE_CONFIG } from '../config';

/**
 * Generates a cache key for a provider result
 */
export function getCacheKey(provider: string, type: string, target: string): string {
  return `${CACHE_CONFIG.KEY_PREFIX}:${provider}:${type}:${target.toLowerCase()}`;
}

/**
 * Gets a cached result from KV
 */
export async function getCachedResult(
  cache: KVNamespace,
  provider: string,
  type: string,
  target: string
): Promise<any | null> {
  try {
    const key = getCacheKey(provider, type, target);
    const cached = await cache.get(key, 'json');
    
    if (cached) {
      return cached;
    }
  } catch (error) {
    console.error('Cache get error:', error);
  }
  
  return null;
}

/**
 * Stores a result in KV cache
 */
export async function setCachedResult(
  cache: KVNamespace,
  provider: string,
  type: string,
  target: string,
  result: any,
  ttl?: number
): Promise<void> {
  try {
    const key = getCacheKey(provider, type, target);
    const expirationTtl = ttl || CACHE_CONFIG.DEFAULT_TTL;
    
    const cacheData = {
      ...result,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + expirationTtl * 1000).toISOString()
    };
    
    await cache.put(key, JSON.stringify(cacheData), {
      expirationTtl
    });
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Clears all cached results (optional admin function)
 */
export async function clearCache(cache: KVNamespace): Promise<void> {
  // Note: KV doesn't support bulk delete, so this would need to track keys separately
  // For now, we rely on TTL expiration
  console.log('Cache clear requested - relying on TTL expiration');
}

/**
 * Gets cache statistics
 */
export async function getCacheStats(cache: KVNamespace): Promise<{ message: string }> {
  // KV doesn't provide built-in stats, so we return a placeholder
  return {
    message: 'Cache is active with 24-hour TTL. Individual results show cache status.'
  };
}

/**
 * Checks if a cached result is still valid
 */
export function isCacheValid(cachedData: any): boolean {
  if (!cachedData || !cachedData.expiresAt) {
    return false;
  }
  
  const expirationTime = new Date(cachedData.expiresAt).getTime();
  const now = Date.now();
  
  return now < expirationTime;
}
