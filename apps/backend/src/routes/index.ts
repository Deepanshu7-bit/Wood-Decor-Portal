import { Router } from "express";
import { healthRouter } from "./health.route.js";

const apiRouter: Router = Router();

// Mount individual domain routers
apiRouter.use("/health", healthRouter);

export { apiRouter };
