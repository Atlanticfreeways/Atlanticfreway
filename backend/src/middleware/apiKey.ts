import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export interface ApiKeyRequest extends Request {
  apiKey?: string;
  apiKeyValid?: boolean;
}

// In production, store API keys in database
const VALID_API_KEYS = new Set([
  process.env.API_KEY_1 || 'dev-key-1',
  process.env.API_KEY_2 || 'dev-key-2',
]);

export const apiKeyMiddleware = (req: ApiKeyRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    // API key is optional for authenticated users
    if (req.headers.authorization) {
      req.apiKeyValid = false;
      return next();
    }

    res.status(401).json({
      success: false,
      error: {
        code: 'MISSING_API_KEY',
        message: 'API key is required',
      },
    });
    return;
  }

  if (!VALID_API_KEYS.has(apiKey)) {
    logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 10)}...`);
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key',
      },
    });
    return;
  }

  req.apiKey = apiKey;
  req.apiKeyValid = true;
  next();
};

export default apiKeyMiddleware;
