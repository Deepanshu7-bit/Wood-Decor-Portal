import mongoose, { Schema, Document, Model } from "mongoose";
import { BranchCode, BranchType } from "@woods-decor/types";

export interface IBranchDocument extends Document {
  name: string;
  code: BranchCode;
  type: BranchType;
  currency: {
    code: "INR" | "AUD";
    symbol: "₹" | "$";
    locale: string;
  };
  timezone: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  geofenceRadiusMeters: number;
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  taxIdentifiers: {
    gstin?: string;
    abn?: string;
    iec?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranchDocument>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    type: {
      type: String,
      enum: ["factory_showroom", "showroom", "international_showroom"],
      required: true,
    },
    currency: {
      code: { type: String, enum: ["INR", "AUD"], default: "INR" },
      symbol: { type: String, default: "₹" },
      locale: { type: String, default: "en-IN" },
    },
    timezone: { type: String, default: "Asia/Kolkata" },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    geofenceRadiusMeters: { type: Number, default: 250 },
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    taxIdentifiers: {
      gstin: { type: String },
      abn: { type: String },
      iec: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for spatial queries ($nearSphere geofence check)
BranchSchema.index({ location: "2dsphere" });

export const BranchModel: Model<IBranchDocument> =
  mongoose.models.Branch || mongoose.model<IBranchDocument>("Branch", BranchSchema);
