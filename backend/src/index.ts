import express from "express";
import cors from "cors";
import compilerRouter from "./modules/compiler/compiler.routes.js";
import { AppError } from "./utils/AppError.js";
import type { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/compiler", compilerRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use(
  (err: AppError | Error, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
