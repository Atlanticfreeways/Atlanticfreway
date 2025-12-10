import User from '../models/User';
import logger from './logger';

export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      logger.info('Database already seeded, skipping...');
      return;
    }

    logger.info('Seeding database...');

    // Create sample users
    const sampleUsers = [
      {
        email: 'user1@example.com',
        password: 'hashed_password_1', // In real app, use bcrypt
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        preferences: {
          currency: 'USD',
          theme: 'light',
          notifications: true,
          language: 'en',
        },
      },
      {
        email: 'user2@example.com',
        password: 'hashed_password_2',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+0987654321',
        preferences: {
          currency: 'EUR',
          theme: 'dark',
          notifications: true,
          language: 'en',
        },
      },
    ];

    await User.insertMany(sampleUsers);
    logger.info(`✓ Seeded ${sampleUsers.length} users`);

  } catch (error) {
    logger.error('✗ Database seeding failed:', error);
    throw error;
  }
};
