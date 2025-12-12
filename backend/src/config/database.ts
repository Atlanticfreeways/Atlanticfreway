import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flight-scanner';

    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    });

    console.log('✓ MongoDB connected successfully');

    // Create indexes
    await createIndexes();
  } catch (error) {
    console.warn('⚠ MongoDB connection failed. Database features will be limited.');
    // Do NOT throw to allow server start
    // throw error; 
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not connected');

    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ createdAt: 1 });

    // Flight indexes
    await db.collection('flights').createIndex({ skyscannerQuoteId: 1 }, { unique: true });
    await db.collection('flights').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await db.collection('flights').createIndex({ 'departure.airport': 1 });
    await db.collection('flights').createIndex({ 'arrival.airport': 1 });
    await db.collection('flights').createIndex({ price: 1 });

    // Booking indexes
    await db.collection('bookings').createIndex({ userId: 1 });
    await db.collection('bookings').createIndex({ bookingReference: 1 }, { unique: true });
    await db.collection('bookings').createIndex({ status: 1 });
    await db.collection('bookings').createIndex({ createdAt: 1 });

    // Price Alert indexes
    await db.collection('pricealerts').createIndex({ userId: 1 });
    await db.collection('pricealerts').createIndex({ 'route.from': 1, 'route.to': 1 });
    await db.collection('pricealerts').createIndex({ isActive: 1 });

    // Search History indexes
    await db.collection('searchhistories').createIndex({ userId: 1 });
    await db.collection('searchhistories').createIndex({ createdAt: 1 });

    console.log('✓ Database indexes created successfully');
  } catch (error) {
    console.error('✗ Failed to create indexes:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ Failed to disconnect MongoDB:', error);
    throw error;
  }
};
