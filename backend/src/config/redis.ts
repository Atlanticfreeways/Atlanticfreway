import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export const initializeRedis = async (): Promise<RedisClientType | null> => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 2000,
        reconnectStrategy: false
      }
    });

    redisClient.on('error', (_err) => {
      // Suppress errors if we know we are failing
    });

    await redisClient.connect();
    console.log('✓ Redis connected');
    return redisClient;
  } catch (error) {
    console.warn('⚠ Redis initialization failed. Caching will be disabled.');
    // Do NOT throw.
    return null;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return redisClient || null;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    console.log('✓ Redis disconnected');
  }
};

// Cache service
export class CacheService {
  private client: RedisClientType | null;

  constructor() {
    this.client = getRedisClient();
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`✗ Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error(`✗ Cache set error for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`✗ Cache delete error for key ${key}:`, error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.client) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error(`✗ Cache invalidate pattern error for ${pattern}:`, error);
    }
  }

  async clear(): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.flushDb();
    } catch (error) {
      console.error('✗ Cache clear error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`✗ Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async getStats(): Promise<{ hitRate: number; memoryUsage: string }> {
    if (!this.client) return { hitRate: 0, memoryUsage: '0B' };
    try {
      const info = await this.client.info('stats');
      const lines = info.split('\r\n');
      const stats: Record<string, string> = {};

      lines.forEach((line) => {
        const [key, value] = line.split(':');
        if (key && value) stats[key] = value;
      });

      const hits = parseInt(stats['keyspace_hits'] || '0');
      const misses = parseInt(stats['keyspace_misses'] || '0');
      const total = hits + misses;
      const hitRate = total > 0 ? (hits / total) * 100 : 0;

      const memInfo = await this.client.info('memory');
      const memLines = memInfo.split('\r\n');
      let memoryUsage = '0B';

      memLines.forEach((line) => {
        if (line.startsWith('used_memory_human:')) {
          memoryUsage = line.split(':')[1];
        }
      });

      return { hitRate: Math.round(hitRate * 100) / 100, memoryUsage };
    } catch (error) {
      console.error('✗ Cache stats error:', error);
      return { hitRate: 0, memoryUsage: '0B' };
    }
  }
}

export default CacheService;
