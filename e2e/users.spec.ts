import { expect, test } from "@playwright/test";

test("completes the persisted users CRUD flow", async ({ page, request }) => {
  const suffix = Date.now();
  const userEmail = `e2e-user-${suffix}@example.com`;
  const adminEmail = `e2e-admin-${suffix}@example.com`;
  let adminId = "";

  const existing = await request.get("http://127.0.0.1:3334/users");
  const users = (await existing.json()) as Array<{ id: string; email: string }>;
  for (const user of users.filter((item) => item.email.startsWith("e2e-"))) {
    await request.delete(`http://127.0.0.1:3334/users/${user.id}`);
  }

  await page.goto("/users");
  await expect(page.getByRole("heading", { name: "Gerenciamento de usuários" })).toBeVisible();

  await page.getByRole("link", { name: "Novo usuário" }).click();
  await page.getByLabel("Nome").fill("Usuário E2E");
  await page.getByLabel("E-mail").fill(userEmail);
  await page.getByLabel("Role").selectOption("USER");
  await page.getByRole("button", { name: "Criar usuário" }).click();
  await expect(page.getByRole("heading", { name: "Usuário E2E" })).toBeVisible();

  await page.getByRole("link", { name: "Editar" }).click();
  await page.getByLabel("Nome").fill("Usuário E2E Editado");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("heading", { name: "Usuário E2E Editado" })).toBeVisible();

  await page.getByRole("link", { name: "Voltar" }).click();
  await page.getByRole("link", { name: "Novo usuário" }).click();
  await page.getByLabel("Nome").fill("Administrador E2E");
  await page.getByLabel("E-mail").fill(adminEmail);
  await page.getByLabel("Role").selectOption("ADMIN");
  await page.getByRole("button", { name: "Criar usuário" }).click();
  adminId = new URL(page.url()).pathname.split("/").pop() ?? "";
  await expect(page.getByText("ADMIN", { exact: true }).first()).toBeVisible();

  await page.getByRole("link", { name: "Voltar" }).click();
  await page.getByRole("link", { name: "Novo usuário" }).click();
  await page.getByLabel("Nome").fill("Duplicado E2E");
  await page.getByLabel("E-mail").fill(adminEmail);
  await page.getByRole("button", { name: "Criar usuário" }).click();
  await expect(page.getByRole("alert")).toContainText("Este e-mail já está em uso");

  await page.getByRole("link", { name: "Voltar" }).click();
  await page.getByRole("button", { name: "Excluir Usuário E2E Editado" }).click();
  await expect(page.getByRole("dialog")).toContainText(userEmail);
  await page.getByRole("button", { name: "Excluir", exact: true }).click();
  await expect(page.getByText("Usuário E2E Editado")).toHaveCount(0);

  await page.reload();
  await expect(
    page.locator("table").getByText("Administrador E2E"),
  ).toBeVisible();

  if (adminId) await request.delete(`http://127.0.0.1:3334/users/${adminId}`);
});
