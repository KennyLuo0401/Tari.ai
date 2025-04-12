import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middleware/error";
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
} from "./types/error";
import { startDCA, stopDCA, getStatus, isRunning } from "./scheduler";

export function createApiServer(port: number) {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Root route
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to the API" });
  });

  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "healthy" });
  });

  // DCA Routes
  app.post("/dca/start", (req: Request, res: Response, next: NextFunction) => {
    try {
      const { interval } = req.body;

      if (!interval || typeof interval !== "number" || interval < 60000) {
        throw new ValidationError(
          "Invalid interval. Must be a number >= 60000 (1 minute)"
        );
      }

      const result = startDCA(interval);
      res.status(200).json({ message: result });
    } catch (error) {
      next(error);
    }
  });

  app.post("/dca/stop", (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = stopDCA();
      res.status(200).json({ message: result });
    } catch (error) {
      next(error);
    }
  });

  app.get("/dca/status", (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = getStatus();
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  });

  // Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Start server
  const server = app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });

  // Handle graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  return app;
}
