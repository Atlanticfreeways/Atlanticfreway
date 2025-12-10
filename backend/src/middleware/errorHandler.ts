import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode}: ${message}`, err.details);

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.name || 'ERROR',
      message,
      details: err.details || {},
    },
  });
};

export default errorHandler;
