import { assertSafeTestDatabase } from "../../src/infrastructure/testing/assertSafeTestDatabase.js";
import "dotenv/config";

import { afterAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import { createPrismaClient } from "../../src/infrastructure/database/prisma/client.js";
import { PrismaUserRepository } from "../../src/adapters/persistence/prisma/PrismaUserRepository.js";
import { createApp } from "../../src/main/app.js";

const testDatabaseUrl = assertSafeTestDatabase();

if (!testDatabaseUrl) {
  throw new Error("TEST_DATABASE_URL is not configured.");
}

const client = createPrismaClient(testDatabaseUrl);
const app = createApp(new PrismaUserRepository(client));

async function createUser(email = "ana@example.com") {
  const response = await request(app).post("/users").send({
    name: "Ana Silva",
    email,
    role: "USER",
  });

  return response.body as { id: string };
}

describe("Users HTTP API", () => {
  beforeEach(async () => {
    assertSafeTestDatabase();
    await client.user.deleteMany();
  });

  afterAll(async () => {
    assertSafeTestDatabase();
    await client.user.deleteMany();
    await client.$disconnect();
  });

  it("POST /users returns 201 for valid input", async () => {
    const response = await request(app).post("/users").send({
      name: "  Ana Silva  ",
      email: "ANA@EXAMPLE.COM",
      role: "USER",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Ana Silva",
      email: "ana@example.com",
      role: "USER",
    });
  });

  it("POST /users returns 400 for invalid input", async () => {
    const response = await request(app).post("/users").send({
      name: "Ana",
      email: "invalid",
      role: "USER",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("DOMAIN_VALIDATION_ERROR");
  });

  it("POST /users returns 409 for duplicated email", async () => {
    await createUser();
    const response = await request(app).post("/users").send({
      name: "Maria",
      email: "ANA@EXAMPLE.COM",
      role: "ADMIN",
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("GET /users returns 200 and the users", async () => {
    await createUser();
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("GET /users/:id returns 200 for an existing user", async () => {
    const user = await createUser();
    const response = await request(app).get(`/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(user.id);
  });

  it("GET /users/:id returns 404 for a missing user", async () => {
    const response = await request(app).get(
      "/users/00000000-0000-4000-8000-000000000000",
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("USER_NOT_FOUND");
  });

  it("PATCH /users/:id returns 200", async () => {
    const user = await createUser();
    const response = await request(app)
      .patch(`/users/${user.id}`)
      .send({ name: "Maria", role: "ADMIN" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ name: "Maria", role: "ADMIN" });
  });

  it("PATCH /users/:id returns 400 for an empty body", async () => {
    const user = await createUser();
    const response = await request(app).patch(`/users/${user.id}`).send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_REQUEST");
  });

  it("PATCH /users/:id returns 404 for a missing user", async () => {
    const response = await request(app)
      .patch("/users/00000000-0000-4000-8000-000000000000")
      .send({ name: "Maria" });

    expect(response.status).toBe(404);
  });

  it("PATCH /users/:id returns 409 for duplicated email", async () => {
    await createUser("ana@example.com");
    const second = await createUser("maria@example.com");
    const response = await request(app)
      .patch(`/users/${second.id}`)
      .send({ email: "ANA@EXAMPLE.COM" });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("DELETE /users/:id returns 204", async () => {
    const user = await createUser();
    const response = await request(app).delete(`/users/${user.id}`);

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  it("DELETE /users/:id returns 404 for a missing user", async () => {
    const response = await request(app).delete(
      "/users/00000000-0000-4000-8000-000000000000",
    );

    expect(response.status).toBe(404);
  });

  it("returns 400 for an invalid role", async () => {
    const response = await request(app).post("/users").send({
      name: "Ana",
      email: "ana@example.com",
      role: "SUPER_ADMIN",
    });

    expect(response.status).toBe(400);
  });

  it("returns security and allowed-origin CORS headers", async () => {
    const response = await request(app)
      .get("/users")
      .set("Origin", "http://localhost:5173");

    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("handles CORS preflight for the configured frontend", async () => {
    const response = await request(app)
      .options("/users")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "POST");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
  });
});
