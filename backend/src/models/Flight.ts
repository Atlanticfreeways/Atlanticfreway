import mongoose, { Schema, Document } from 'mongoose';

export interface IFlight extends Document {
  skyscannerQuoteId: string;
  departure: {
    airport: string;
    city: string;
    date: Date;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    date: Date;
    time: string;
  };
  airline: string;
  price: number;
  currency: string;
  stops: number;
  duration: number;
  deeplink: string;
  segments: Array<{
    departure: string;
    arrival: string;
    airline: string;
    flightNumber: string;
  }>;
  cachedAt: Date;
  expiresAt: Date;
}

const flightSchema = new Schema<IFlight>(
  {
    skyscannerQuoteId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    departure: {
      airport: String,
      city: String,
      date: Date,
      time: String,
    },
    arrival: {
      airport: String,
      city: String,
      date: Date,
      time: String,
    },
    airline: String,
    price: Number,
    currency: String,
    stops: Number,
    duration: Number,
    deeplink: String,
    segments: [
      {
        departure: String,
        arrival: String,
        airline: String,
        flightNumber: String,
      },
    ],
    cachedAt: Date,
    expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

export default mongoose.model<IFlight>('Flight', flightSchema);
