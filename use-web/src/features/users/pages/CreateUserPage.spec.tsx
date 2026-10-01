import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../../../lib/api";
import { usersApi } from "../api/users.api";
import { CreateUserPage } from "./CreateUserPage";

vi.mock("../api/users.api", () => ({ usersApi: { create: vi.fn() } }));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/users/new"]}>
      <Routes>
        <Route path="/users/new" element={<CreateUserPage />} />
        <Route path="/users/:id" element={<p>Detalhes criados</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nome"), "Ana Silva");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: "Criar usuário" }));
}

describe("CreateUserPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a user and navigates to details", async () => {
    vi.mocked(usersApi.create).mockResolvedValue({
      id: "user-1",
      name: "Ana Silva",
      email: "ana@example.com",
      role: "USER",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    renderPage();
    await fillForm();
    expect(await screen.findByText("Detalhes criados")).toBeInTheDocument();
  });

  it("shows the conflict message for duplicated email", async () => {
    vi.mocked(usersApi.create).mockRejectedValue(
      new ApiError(409, "EMAIL_ALREADY_EXISTS", "duplicate"),
    );
    renderPage();
    await fillForm();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Este e-mail já está em uso",
    );
  });
});
