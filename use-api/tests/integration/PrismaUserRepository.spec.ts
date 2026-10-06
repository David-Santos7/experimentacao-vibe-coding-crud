import { assertSafeTestDatabase } from "../../src/infrastructure/testing/assertSafeTestDatabase.js";
import "dotenv/config";

import { randomUUID } from "node:crypto";

import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { EmailAlreadyExistsError } from "../../src/application/errors/EmailAlreadyExistsError.js";
import { User } from "../../src/domain/entities/User.js";
import { createPrismaClient } from "../../src/infrastructure/database/prisma/client.js";
import { PrismaUserRepository } from "../../src/adapters/persistence/prisma/PrismaUserRepository.js";

const testDatabaseUrl = assertSafeTestDatabase();

if (!testDatabaseUrl) {
  throw new Error("TEST_DATABASE_URL is not configured.");
}

const client = createPrismaClient(testDatabaseUrl);
const repository = new PrismaUserRepository(client);

function makeUser(email = "ana@example.com"): User {
  const now = new Date();

  return new User({
    id: randomUUID(),
    name: "Ana Silva",
    email,
    role: "USER",
    createdAt: now,
    updatedAt: now,
  });
}

describe("PrismaUserRepository", () => {
  beforeEach(async () => {
    assertSafeTestDatabase();
    await client.user.deleteMany();
  });

  afterAll(async () => {
    assertSafeTestDatabase();
    await client.user.deleteMany();
    await client.$disconnect();
  });

  it("creates and finds a user by id", async () => {
    const user = makeUser();

    const created = await repository.create(user);
    const found = await repository.findById(user.id);

    expect(created).toEqual(user);
    expect(found).toEqual(user);
    expect(found).toBeInstanceOf(User);
  });

  it("finds a user by email", async () => {
    const user = makeUser();
    await repository.create(user);

    await expect(repository.findByEmail(user.email)).resolves.toEqual(user);
    await expect(
      repository.findByEmail("missing@example.com"),
    ).resolves.toBeNull();
  });

  it("lists all users", async () => {
    await repository.create(makeUser("ana@example.com"));
    await repository.create(makeUser("maria@example.com"));

    await expect(repository.findAll()).resolves.toHaveLength(2);
  });

  it("updates a user and preserves createdAt", async () => {
    const user = makeUser();
    await repository.create(user);
    const createdAt = user.createdAt;

    user.update({ name: "Maria", role: "ADMIN" }, new Date());
    const updated = await repository.update(user);

    expect(updated.name).toBe("Maria");
    expect(updated.role).toBe("ADMIN");
    expect(updated.createdAt).toEqual(createdAt);
  });

  it("deletes a user by id", async () => {
    const user = makeUser();
    await repository.create(user);

    await expect(repository.deleteById(user.id)).resolves.toBe(true);
    await expect(repository.deleteById(user.id)).resolves.toBe(false);
    await expect(repository.findById(user.id)).resolves.toBeNull();
  });

  it("translates unique email violations", async () => {
    await repository.create(makeUser("same@example.com"));

    await expect(
      repository.create(makeUser("same@example.com")),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });
});
