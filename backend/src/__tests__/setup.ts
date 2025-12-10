// Test setup file
// Configure test environment before running tests

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/flight-scanner-test';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
