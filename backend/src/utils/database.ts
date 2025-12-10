import { CacheService } from '../config/redis';
import logger from '../config/logger';

const cacheService = new CacheService();

/**
 * Generate cache key with prefix
 */
export const generateCacheKey = (prefix: string, ...args: (string | number)[]): string => {
  return `${prefix}:${args.join(':')}`;
};

/**
 * Cache key prefixes
 */
export const CACHE_KEYS = {
  FLIGHT_SEARCH: 'flight:search',
  FLIGHT_DETAILS: 'flight:details',
  FLIGHT_TRENDING: 'flight:trending',
  FLIGHT_PRICE_HISTORY: 'flight:price-history',
  HOTEL_SEARCH: 'hotel:search',
  HOTEL_DETAILS: 'hotel:details',
  HOTEL_NEAR_AIRPORT: 'hotel:near-airport',
  USER_PROFILE: 'user:profile',
  USER_BOOKINGS: 'user:bookings',
  EXCHANGE_RATES: 'exchange-rates',
  AIRPORT_DATA: 'airport:data',
};

/**
 * Cache TTL values (in seconds)
 */
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 3600, // 1 hour
  LONG: 86400, // 24 hours
  VERY_LONG: 604800, // 7 days
};

/**
 * Get cached data or fetch from database
 */
export const getOrCache = async <T>(
  cacheKey: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> => {
  try {
    // Try to get from cache
    const cached = await cacheService.get<T>(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    // Fetch from database
    logger.debug(`Cache miss for key: ${cacheKey}, fetching from database`);
    const data = await fetchFn();

    // Store in cache
    await cacheService.set(cacheKey, data, ttl);

    return data;
  } catch (error) {
    logger.error(`Error in getOrCache for key ${cacheKey}:`, error);
    // Fallback to direct fetch if cache fails
    return fetchFn();
  }
};

/**
 * Invalidate cache by pattern
 */
export const invalidateCache = async (pattern: string): Promise<void> => {
  try {
    await cacheService.invalidatePattern(pattern);
    logger.info(`Cache invalidated for pattern: ${pattern}`);
  } catch (error) {
    logger.error(`Error invalidating cache for pattern ${pattern}:`, error);
  }
};

/**
 * Clear all cache
 */
export const clearAllCache = async (): Promise<void> => {
  try {
    await cacheService.clear();
    logger.info('All cache cleared');
  } catch (error) {
    logger.error('Error clearing all cache:', error);
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async () => {
  try {
    return await cacheService.getStats();
  } catch (error) {
    logger.error('Error getting cache stats:', error);
    return { hitRate: 0, memoryUsage: '0B' };
  }
};

export default {
  generateCacheKey,
  CACHE_KEYS,
  CACHE_TTL,
  getOrCache,
  invalidateCache,
  clearAllCache,
  getCacheStats,
};
