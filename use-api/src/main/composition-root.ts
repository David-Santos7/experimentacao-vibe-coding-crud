import { randomUUID } from "node:crypto";
import type { UserRepository } from "../application/repositories/UserRepository.js";
import { CreateUser } from "../application/use-cases/CreateUser.js";
import { DeleteUser } from "../application/use-cases/DeleteUser.js";
import { GetUser } from "../application/use-cases/GetUser.js";
import { ListUsers } from "../application/use-cases/ListUsers.js";
import { UpdateUser } from "../application/use-cases/UpdateUser.js";
import { prisma } from "../infrastructure/database/prisma/client.js";
import { PrismaUserRepository } from "../adapters/persistence/prisma/PrismaUserRepository.js";
import { UsersController } from "../adapters/http/controllers/UsersController.js";

export function createUsersController(
  repository: UserRepository = new PrismaUserRepository(prisma),
): UsersController {
  return new UsersController(
    new CreateUser(repository, randomUUID),
    new GetUser(repository),
    new ListUsers(repository),
    new UpdateUser(repository),
    new DeleteUser(repository),
  );
}
