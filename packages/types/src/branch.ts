import { z } from "zod";

export const BranchCodeEnum = z.enum(["MOH", "KHR", "AUS"]);
export type BranchCode = z.infer<typeof BranchCodeEnum>;

export const BranchTypeEnum = z.enum([
  "factory_showroom",
  "showroom",
  "international_showroom",
]);
export type BranchType = z.infer<typeof BranchTypeEnum>;

export interface IBranch {
  id: string;
  name: string;
  code: BranchCode;
  type: BranchType;
  currency: {
    code: "INR" | "AUD";
    symbol: "₹" | "$";
    locale: string;
  };
  timezone: string; // e.g. "Asia/Kolkata" or "Australia/Sydney"
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
}
