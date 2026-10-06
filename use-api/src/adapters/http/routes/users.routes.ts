import { Router } from "express";

import type { UsersController } from "../controllers/UsersController.js";

export function createUsersRouter(controller: UsersController): Router {
  const router = Router();

  router.post("/users", controller.create);
  router.get("/users", controller.list);
  router.get("/users/:id", controller.get);
  router.patch("/users/:id", controller.update);
  router.delete("/users/:id", controller.delete);

  return router;
}
