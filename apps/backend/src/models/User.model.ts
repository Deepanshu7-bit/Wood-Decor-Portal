import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole, UserStatus, Department } from "@woods-decor/types";

export interface IUserDocument extends Document {
  employeeCode: string;
  name: string;
  phone: string;
  email?: string;
  passwordHash: string;
  role: UserRole;
  branchId: Types.ObjectId | null;
  department: Department;
  reportingManagerId?: Types.ObjectId | null;
  shift: {
    startTime: string; // HH:MM
    minWorkHours: number;
    graceMinutes: number;
  };
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true, // Allows null/empty values without unique collisions
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "hr", "branch_manager", "sales_staff", "workshop_labour"],
      default: "sales_staff",
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },
    department: {
      type: String,
      enum: ["Sales", "Production", "Design", "Accounts", "HR", "Logistics", "Admin"],
      default: "Sales",
    },
    reportingManagerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    shift: {
      startTime: { type: String, default: "09:30" },
      minWorkHours: { type: Number, default: 8 },
      graceMinutes: { type: Number, default: 15 },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "resigned"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
