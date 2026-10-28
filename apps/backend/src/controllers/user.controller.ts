import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

export class UserController {
  /**
   * POST /api/v1/users
   * Create a new employee
   */
  static async create(req: Request, res: Response) {
    try {
      const user = await UserService.createEmployee(req.body);
      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create employee",
      });
    }
  }

  /**
   * GET /api/v1/users
   * List all employees with filters
   */
  static async getAll(req: Request, res: Response) {
    try {
      const { status, branchId, search } = req.query;
      const users = await UserService.getEmployees({
        status: status as string,
        branchId: branchId as string,
        search: search as string,
      });

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch employees",
      });
    }
  }

  /**
   * GET /api/v1/users/:id
   * Get single employee
   */
  static async getById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await UserService.getEmployeeById(id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Employee not found",
      });
    }
  }

  /**
   * PATCH /api/v1/users/:id
   * Update employee details
   */
  static async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updatedUser = await UserService.updateEmployee(id, req.body);
      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update employee",
      });
    }
  }

  /**
   * PATCH /api/v1/users/:id/status
   * Activate / Deactivate employee (Soft-delete)
   */
  static async toggleStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!status || !["active", "inactive", "resigned"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Valid status required: active, inactive, or resigned",
        });
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await UserService.setStatus(id, status);
      res.status(200).json({
        success: true,
        message: `Employee status changed to ${status}`,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update status",
      });
    }
  }
}
