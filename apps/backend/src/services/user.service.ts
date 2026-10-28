import bcrypt from "bcryptjs";
import { CreateUserInput, CreateUserSchema, UserStatus } from "@woods-decor/types";
import { UserModel, IUserDocument } from "../models/User.model.js";
import { BranchModel } from "../models/Branch.model.js";

export class UserService {
  /**
   * Create a new employee/user
   */
  static async createEmployee(input: CreateUserInput) {
    // 1. Validate payload with Zod schema
    const validatedData = CreateUserSchema.parse(input);

    // 2. Check for duplicate employee code
    const existingCode = await UserModel.findOne({ employeeCode: validatedData.employeeCode.toUpperCase() });
    if (existingCode) {
      throw new Error(`Employee Code ${validatedData.employeeCode} is already assigned.`);
    }

    // 3. Auto-assign to Mohali branch if not explicitly provided
    let branchId = validatedData.branchId;
    if (!branchId) {
      const defaultBranch = await BranchModel.findOne({ code: "MOH" });
      if (defaultBranch) {
        branchId = defaultBranch._id.toString();
      }
    }

    // 4. Hash the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    // 5. Persist to MongoDB
    const user = await UserModel.create({
      employeeCode: validatedData.employeeCode.toUpperCase(),
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email || undefined,
      passwordHash,
      role: validatedData.role,
      branchId,
      department: validatedData.department,
      reportingManagerId: validatedData.reportingManagerId || null,
      shift: validatedData.shift,
      status: "active",
    });

    // Return sanitized document without passwordHash
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    return userObj;
  }

  /**
   * List all employees with search & filtering
   */
  static async getEmployees(params: {
    status?: string;
    branchId?: string;
    search?: string;
  }) {
    const filter: any = {};

    if (params.status && params.status !== "all") {
      filter.status = params.status;
    }

    if (params.branchId && params.branchId !== "all") {
      filter.branchId = params.branchId;
    }

    if (params.search) {
      const regex = new RegExp(params.search, "i");
      filter.$or = [{ name: regex }, { employeeCode: regex }, { phone: regex }];
    }

    const users = await UserModel.find(filter)
      .select("-passwordHash")
      .populate("branchId", "name code city")
      .sort({ createdAt: -1 });

    return users;
  }

  /**
   * Get employee by ID
   */
  static async getEmployeeById(id: string) {
    const user = await UserModel.findById(id).select("-passwordHash").populate("branchId");
    if (!user) {
      throw new Error("Employee not found");
    }
    return user;
  }

  /**
   * Update employee details
   */
  static async updateEmployee(id: string, updates: Partial<CreateUserInput>) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("Employee not found");
    }

    if (updates.name) user.name = updates.name;
    if (updates.phone) user.phone = updates.phone;
    if (updates.email !== undefined) user.email = updates.email || undefined;
    if (updates.role) user.role = updates.role;
    if (updates.branchId) user.branchId = updates.branchId as any;
    if (updates.department) user.department = updates.department;
    if (updates.shift) user.shift = updates.shift;

    // Optional password reset
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(updates.password, salt);
    }

    await user.save();

    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    return userObj;
  }

  /**
   * Soft-delete / Toggle status (active <-> inactive / resigned)
   */
  static async setStatus(id: string, status: UserStatus) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("Employee not found");
    }

    user.status = status;
    await user.save();

    return {
      id: user._id,
      employeeCode: user.employeeCode,
      name: user.name,
      status: user.status,
    };
  }
}
