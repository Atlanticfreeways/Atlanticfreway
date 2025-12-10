import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  bookingReference: string;
  flights: Array<{
    flightId: mongoose.Types.ObjectId;
    skyscannerQuoteId: string;
    price: number;
  }>;
  hotel?: {
    hotelId: mongoose.Types.ObjectId;
    skyscannerHotelId: string;
    nights: number;
    pricePerNight: number;
    totalPrice: number;
  };
  passengers: Array<{
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
    passport: string;
  }>;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentId: string;
  paymentStatus: 'pending' | 'succeeded' | 'failed';
  createdAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    flights: [
      {
        flightId: Schema.Types.ObjectId,
        skyscannerQuoteId: String,
        price: Number,
      },
    ],
    hotel: {
      hotelId: Schema.Types.ObjectId,
      skyscannerHotelId: String,
      nights: Number,
      pricePerNight: Number,
      totalPrice: Number,
    },
    passengers: [
      {
        firstName: String,
        lastName: String,
        email: String,
        dateOfBirth: Date,
        passport: String,
      },
    ],
    totalPrice: Number,
    currency: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending',
    },
    confirmedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
