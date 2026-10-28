import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { apiRouter } from "./routes/index.js";

const app: Application = express();

// 1. Core Middlewares
// CORS: Allows frontend (e.g. Next.js on port 3000) to communicate with this backend
app.use(
  cors({
    origin: [ENV.CLIENT_URL, "http://localhost:3000"],
    credentials: true,
  })
);

// Body Parser: Automatically parses incoming JSON request bodies into `req.body`
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 2. Main API Router
// All routes will be prefixed with /api/v1
app.use("/api/v1", apiRouter);

// 3. Fallback 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on Woods Decor API`,
  });
});

// 4. Global Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Backend Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: ENV.NODE_ENV === "development" ? err.message : undefined,
  });
});

export { app };
