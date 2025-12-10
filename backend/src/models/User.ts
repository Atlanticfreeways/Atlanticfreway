import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  preferences: {
    currency: string;
    theme: string;
    notifications: boolean;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    phone: String,
    preferences: {
      currency: { type: String, default: 'USD' },
      theme: { type: String, default: 'light' },
      notifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
    },
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
