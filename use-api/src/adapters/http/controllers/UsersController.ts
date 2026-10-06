import type { NextFunction, Request, Response } from "express";

import type { CreateUser } from "../../../application/use-cases/CreateUser.js";
import type { DeleteUser } from "../../../application/use-cases/DeleteUser.js";
import type { GetUser } from "../../../application/use-cases/GetUser.js";
import type { ListUsers } from "../../../application/use-cases/ListUsers.js";
import type {
  UpdateUser,
  UpdateUserInput,
} from "../../../application/use-cases/UpdateUser.js";
import type { User } from "../../../domain/entities/User.js";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "../schemas/user.schemas.js";

function presentUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UsersController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly getUser: GetUser,
    private readonly listUsers: ListUsers,
    private readonly updateUser: UpdateUser,
    private readonly deleteUser: DeleteUser,
  ) {}

  create = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = createUserSchema.parse(request.body);
      const user = await this.createUser.execute(input);
      response.status(201).json(presentUser(user));
    } catch (error) {
      next(error);
    }
  };

  list = async (
    _request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await this.listUsers.execute();
      response.json(users.map(presentUser));
    } catch (error) {
      next(error);
    }
  };

  get = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = userIdSchema.parse(request.params);
      response.json(presentUser(await this.getUser.execute(id)));
    } catch (error) {
      next(error);
    }
  };

  update = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = userIdSchema.parse(request.params);
      const input = updateUserSchema.parse(request.body);
      const updateInput: UpdateUserInput = { id };

      if (input.name !== undefined) updateInput.name = input.name;
      if (input.email !== undefined) updateInput.email = input.email;
      if (input.role !== undefined) updateInput.role = input.role;

      response.json(presentUser(await this.updateUser.execute(updateInput)));
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = userIdSchema.parse(request.params);
      await this.deleteUser.execute(id);
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
