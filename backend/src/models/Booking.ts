import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  user?: mongoose.Types.ObjectId; // Optional for guest/unregistered, but mandatory for dashboard visibility
  flightId: string;
  bookingReference: string;
  passengerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    passport?: string;
  };
  flightDetails: {
    airline: string;
    flightNumber: string;
    from: string;
    to: string;
    departDate: Date;
    arriveDate: Date;
    price: number;
  };
  status: 'confirmed' | 'cancelled' | 'completed';
  safetyScoreSnapshot: number;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  flightId: { type: String, required: true },
  bookingReference: { type: String, required: true, unique: true },
  passengerDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    passport: String
  },
  flightDetails: {
    airline: { type: String, required: true },
    flightNumber: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departDate: { type: Date, required: true },
    arriveDate: { type: Date, required: true },
    price: { type: Number, required: true }
  },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  safetyScoreSnapshot: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
