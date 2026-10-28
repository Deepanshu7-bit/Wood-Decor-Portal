import { z } from "zod";

export const AttendanceStatusEnum = z.enum(["on-time", "late", "half-day"]);
export type AttendanceStatus = z.infer<typeof AttendanceStatusEnum>;

export const PunchCheckInSchema = z.object({
  selfieBase64: z.string().min(1, "Selfie is required"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional(),
  }),
  lateReason: z.string().optional().default(""),
});
export type PunchCheckInInput = z.infer<typeof PunchCheckInSchema>;

export interface IAttendance {
  id: string;
  userId: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  checkIn?: {
    timestamp: Date;
    selfieUrl: string;
    location: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
    isOffSite: boolean;
    distanceFromBranchMeters: number;
    lateReason?: string;
    status: AttendanceStatus;
  };
  checkOut?: {
    timestamp: Date;
    selfieUrl: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
    isOffSite: boolean;
  };
  totalWorkHours?: number;
  approvalStatus: "approved" | "pending_regularization" | "rejected";
}
