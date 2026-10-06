import { EmailAlreadyExistsError } from "../../../application/errors/EmailAlreadyExistsError.js";
import type { UserRepository } from "../../../application/repositories/UserRepository.js";
import { User } from "../../../domain/entities/User.js";
import {
  Prisma,
  type PrismaClient,
  type User as PrismaUser,
} from "../../../infrastructure/generated/prisma/client.js";

function toDomainUser(user: PrismaUser): User {
  return new User({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly client: PrismaClient) {}

  async create(user: User): Promise<User> {
    try {
      const created = await this.client.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });

      return toDomainUser(created);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new EmailAlreadyExistsError();
      }

      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.client.user.findUnique({ where: { id } });

    return user ? toDomainUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.client.user.findUnique({ where: { email } });

    return user ? toDomainUser(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.client.user.findMany({
      orderBy: { createdAt: "asc" },
    });

    return users.map(toDomainUser);
  }

  async update(user: User): Promise<User> {
    try {
      const updated = await this.client.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
          updatedAt: user.updatedAt,
        },
      });

      return toDomainUser(updated);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new EmailAlreadyExistsError();
      }

      throw error;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.client.user.deleteMany({ where: { id } });

    return result.count > 0;
  }
}
