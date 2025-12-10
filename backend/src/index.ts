import app from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeRedis, closeRedis } from './config/redis';
import logger from './config/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Initialize Redis
    await initializeRedis();

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`✓ Server running on http://localhost:${PORT}`);
      logger.info(`✓ Health check: http://localhost:${PORT}/health`);
      logger.info(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);
      
      server.close(async () => {
        try {
          await disconnectDatabase();
          await closeRedis();
          logger.info('✓ Server shut down gracefully');
          process.exit(0);
        } catch (error) {
          logger.error('✗ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('✗ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
