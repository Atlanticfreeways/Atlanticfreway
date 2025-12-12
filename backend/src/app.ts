import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import errorHandler from './middleware/errorHandler';
// import logger from './config/logger';
import { globalRateLimiter } from './middleware/rateLimiter';
import requestLogger from './middleware/requestLogger';
import securityHeaders from './middleware/securityHeaders';

dotenv.config();

const app: Express = express();

// Security middleware
app.use(securityHeaders);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN, 'http://localhost:5173'] : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(globalRateLimiter);

// Health check (no rate limiting)
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Error handling (must be last)
app.use(errorHandler);

export default app;
