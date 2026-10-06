import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import type { UserRepository } from "../application/repositories/UserRepository.js";
import { errorHandler } from "../adapters/http/middlewares/errorHandler.js";
import { createUsersRouter } from "../adapters/http/routes/users.routes.js";
import { createUsersController } from "./composition-root.js";

export function createApp(repository?: UserRepository): Express {
  const app = express();
  const controller = createUsersController(repository);
  const frontendUrl = process.env["FRONTEND_URL"] ?? "http://localhost:5173";

  app.use(helmet());
  app.use(cors({ origin: frontendUrl }));
  app.use(express.json());
  app.use(createUsersRouter(controller));
  app.use(errorHandler);

  return app;
}

export const app = createApp();
