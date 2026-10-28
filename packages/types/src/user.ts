import { z } from "zod";

export const UserRoleEnum = z.enum([
  "super_admin",
  "hr",
  "branch_manager",
  "sales_staff",
  "workshop_labour",
]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserStatusEnum = z.enum(["active", "inactive", "resigned"]);
export type UserStatus = z.infer<typeof UserStatusEnum>;

export const DepartmentEnum = z.enum([
  "Sales",
  "Production",
  "Design",
  "Accounts",
  "HR",
  "Logistics",
  "Admin",
]);
export type Department = z.infer<typeof DepartmentEnum>;

// Zod schema for validating user creation
export const CreateUserSchema = z.object({
  employeeCode: z.string().min(3).max(20),
  name: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6),
  role: UserRoleEnum,
  branchId: z.string().optional().nullable(),
  department: DepartmentEnum,
  reportingManagerId: z.string().optional().nullable(),
  shift: z.object({
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format required"),
    minWorkHours: z.number().min(1).max(24).default(8),
    graceMinutes: z.number().min(0).max(60).default(15),
  }),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// User Interface
export interface IUser {
  id: string;
  employeeCode: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  branchId?: string | null;
  department: Department;
  reportingManagerId?: string | null;
  shift: {
    startTime: string;
    minWorkHours: number;
    graceMinutes: number;
  };
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
