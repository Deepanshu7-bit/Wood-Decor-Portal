import { Router } from "express";
import { healthRouter } from "./health.route.js";
import { userRouter } from "./user.route.js";

const apiRouter: Router = Router();

// Mount individual domain routers
apiRouter.use("/health", healthRouter);
apiRouter.use("/users", userRouter);

export { apiRouter };
