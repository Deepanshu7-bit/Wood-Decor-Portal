import { Router, Request, Response } from "express";

const router: Router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint to verify backend is alive
 * @access  Public
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "Woods Decor Management API",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export const healthRouter: Router = router;
