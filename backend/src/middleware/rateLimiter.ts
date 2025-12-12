import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../config/redis';
import logger from '../config/logger';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  message: 'Too many requests, please try again later',
};

export const createRateLimiter = (config: Partial<RateLimitConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redis = getRedisClient();

      if (!redis) {
        return next();
      }

      const key = `rate-limit:${req.ip}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, Math.ceil(finalConfig.windowMs / 1000));
      }

      const remaining = Math.max(0, finalConfig.maxRequests - current);

      res.setHeader('X-RateLimit-Limit', finalConfig.maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + finalConfig.windowMs).toISOString());

      if (current > finalConfig.maxRequests) {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: finalConfig.message,
            retryAfter: Math.ceil(finalConfig.windowMs / 1000),
          },
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Rate limiter error:', error);
      // If Redis fails, allow request to proceed
      next();
    }
  };
};

// Specific rate limiters
export const globalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many login attempts, please try again later',
});

export const searchRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
  message: 'Too many search requests, please try again later',
});

export const bookingRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: 'Too many booking requests, please try again later',
});

export default createRateLimiter;
