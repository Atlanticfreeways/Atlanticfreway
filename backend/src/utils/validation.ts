import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Flight search schema
export const flightSearchSchema = z.object({
  departure: z.string().min(3, 'Departure airport code required'),
  arrival: z.string().min(3, 'Arrival airport code required'),
  departDate: z.string().datetime('Invalid departure date'),
  returnDate: z.string().datetime('Invalid return date').optional(),
  passengers: z.number().min(1, 'At least 1 passenger required').max(9, 'Maximum 9 passengers'),
  tripType: z.enum(['oneway', 'roundtrip', 'multicity']),
});

// Hotel search schema
export const hotelSearchSchema = z.object({
  city: z.string().min(1, 'City is required'),
  checkIn: z.string().datetime('Invalid check-in date'),
  checkOut: z.string().datetime('Invalid check-out date'),
  guests: z.number().min(1, 'At least 1 guest required'),
  rooms: z.number().min(1, 'At least 1 room required'),
});

// Booking schema
export const bookingSchema = z.object({
  flights: z.array(z.string()).min(1, 'At least one flight required'),
  hotelId: z.string().optional(),
  passengers: z.array(
    z.object({
      firstName: z.string().min(1, 'First name required'),
      lastName: z.string().min(1, 'Last name required'),
      email: z.string().email('Invalid email'),
      dateOfBirth: z.string().datetime('Invalid date of birth'),
      passport: z.string().min(1, 'Passport number required'),
    })
  ),
});

// Price alert schema
export const priceAlertSchema = z.object({
  from: z.string().min(3, 'Departure airport code required'),
  to: z.string().min(3, 'Arrival airport code required'),
  targetPrice: z.number().positive('Target price must be positive'),
  currency: z.string().length(3, 'Currency code must be 3 characters'),
});

// User profile schema
export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

// User preferences schema
export const userPreferencesSchema = z.object({
  currency: z.string().length(3, 'Currency code must be 3 characters'),
  theme: z.enum(['light', 'dark']),
  notifications: z.boolean(),
  language: z.string().length(2, 'Language code must be 2 characters'),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type FlightSearchInput = z.infer<typeof flightSearchSchema>;
export type HotelSearchInput = z.infer<typeof hotelSearchSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type PriceAlertInput = z.infer<typeof priceAlertSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
