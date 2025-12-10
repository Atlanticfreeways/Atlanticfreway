import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:5000',

  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/flight-scanner',
  mongodbTestUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/flight-scanner-test',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  jwtExpiry: process.env.JWT_EXPIRY || '30d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '90d',

  // External APIs
  skyscannerApiKey: process.env.SKYSCANNER_API_KEY || '',
  skyscannerApiUrl: process.env.SKYSCANNER_API_URL || 'https://api.skyscanner.com',

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',

  // SendGrid
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@flightscanner.com',

  // Exchange Rates
  exchangeRatesApiKey: process.env.EXCHANGE_RATES_API_KEY || '',

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',

  // Derived
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

export default config;
