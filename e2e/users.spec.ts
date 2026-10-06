import { test as base, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { API_URL } from "./config";

type User = { id: string; name: string; email: string; role: string };
const test = base.extend<{ seededUser: User }>({
  seededUser: async ({ request }, use) => {
    const response = await request.post(`${API_URL}/users`, {
      data: {
        name: "Usuário E2E",
        email: `e2e-${randomUUID()}@example.com`,
        role: "USER",
      },
    });
    expect(response.status()).toBe(201);
    const user = (await response.json()) as User;
    try {
      await use(user);
    } finally {
      const cleanup = await request.delete(`${API_URL}/users/${user.id}`);
      expect([204, 404]).toContain(cleanup.status());
    }
  },
});

test("creates and reads a user", async ({ page, request }) => {
  const email = `e2e-${randomUUID()}@example.com`;
  let id: string | undefined;
  try {
    await page.goto("/users/new");
    await page.getByLabel("Nome").fill("Administrador E2E");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Role").selectOption("ADMIN");
    await page.getByRole("button", { name: "Criar usuário" }).click();
    await expect(
      page.getByRole("heading", { name: "Administrador E2E" }),
    ).toBeVisible();
    id = new URL(page.url()).pathname.split("/").pop();
    await expect(
      page.getByText("ADMIN", { exact: true }).first(),
    ).toBeVisible();
  } finally {
    if (!id) {
      const result = await request.get(`${API_URL}/users`);
      const users = (await result.json()) as User[];
      id = users.find((user) => user.email === email)?.id;
    }
    if (id)
      expect((await request.delete(`${API_URL}/users/${id}`)).status()).toBe(
        204,
      );
  }
});

test("edits a user", async ({ page, seededUser }) => {
  await page.goto(`/users/${seededUser.id}/edit`);
  await page.getByLabel("Nome").fill("Usuário E2E Editado");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(
    page.getByRole("heading", { name: "Usuário E2E Editado" }),
  ).toBeVisible();
});

test("rejects a duplicate email", async ({ page, seededUser }) => {
  await page.goto("/users/new");
  await page.getByLabel("Nome").fill("Duplicado E2E");
  await page.getByLabel("E-mail").fill(seededUser.email);
  await page.getByRole("button", { name: "Criar usuário" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Este e-mail já está em uso",
  );
});

test("cancels and confirms deletion", async ({ page, seededUser }) => {
  await page.goto("/users");
  const row = page.getByRole("row").filter({ hasText: seededUser.email });
  await row.getByRole("button", { name: "Excluir Usuário E2E" }).click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Excluir Usuário E2E" }).click();
  await expect(page.getByRole("dialog")).toContainText(seededUser.email);
  await page.getByRole("button", { name: "Excluir", exact: true }).click();
  await expect(page.getByText(seededUser.email, { exact: true })).toHaveCount(
    0,
  );
});

test("persists after refresh", async ({ page, seededUser }) => {
  await page.goto(`/users/${seededUser.id}`);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: seededUser.name }),
  ).toBeVisible();
  await expect(page.getByText(seededUser.email, { exact: true })).toBeVisible();
});
