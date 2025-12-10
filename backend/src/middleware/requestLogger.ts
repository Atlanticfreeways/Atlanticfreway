import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export interface RequestWithTimestamp extends Request {
  startTime?: number;
}

export const requestLogger = (req: RequestWithTimestamp, res: Response, next: NextFunction) => {
  req.startTime = Date.now();

  // Log request
  logger.info(`→ ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    query: req.query,
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - (req.startTime || 0);

    logger.info(`← ${req.method} ${req.path} ${res.statusCode}`, {
      duration: `${duration}ms`,
      statusCode: res.statusCode,
    });

    return originalSend.call(this, data);
  };

  next();
};

export default requestLogger;
