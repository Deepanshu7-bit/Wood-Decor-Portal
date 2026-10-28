import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router: Router = Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all employees with search & filtering
 */
router.get("/", UserController.getAll);

/**
 * @route   POST /api/v1/users
 * @desc    Create a new employee
 */
router.post("/", UserController.create);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get single employee details
 */
router.get("/:id", UserController.getById);

/**
 * @route   PATCH /api/v1/users/:id
 * @desc    Update employee details
 */
router.patch("/:id", UserController.update);

/**
 * @route   PATCH /api/v1/users/:id/status
 * @desc    Soft-delete / Toggle status (active/inactive/resigned)
 */
router.patch("/:id/status", UserController.toggleStatus);

export const userRouter: Router = router;
