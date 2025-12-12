import mongoose, { Schema, Document } from 'mongoose';

export interface ISafetyRegion extends Document {
    countryCode: string; // ISO code or Name used as ID
    name: string;
    advisoryLevel: number; // 1-4
    score: number; // 0-100 (Derived from level)
    summary: string;
    details: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    lastUpdated: Date;
}

const SafetyRegionSchema: Schema = new Schema({
    countryCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    advisoryLevel: { type: Number, required: true },
    score: { type: Number, required: true },
    summary: { type: String, required: true },
    details: { type: String },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<ISafetyRegion>('SafetyRegion', SafetyRegionSchema);
