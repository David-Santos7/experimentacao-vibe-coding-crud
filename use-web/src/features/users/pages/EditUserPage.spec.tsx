import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usersApi } from "../api/users.api";
import type { User } from "../types/user.types";
import { EditUserPage } from "./EditUserPage";

vi.mock("../api/users.api", () => ({
  usersApi: { get: vi.fn(), update: vi.fn() },
}));

const ana: User = {
  id: "user-1",
  name: "Ana Silva",
  email: "ana@example.com",
  role: "USER",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/users/user-1/edit"]}>
      <Routes>
        <Route path="/users/:id/edit" element={<EditUserPage />} />
        <Route path="/users/:id" element={<p>Detalhes atualizados</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EditUserPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads and updates a user", async () => {
    const user = userEvent.setup();
    vi.mocked(usersApi.get).mockResolvedValue(ana);
    vi.mocked(usersApi.update).mockResolvedValue({ ...ana, name: "Ana Souza" });
    renderPage();

    const name = await screen.findByLabelText("Nome");
    expect(name).toHaveValue("Ana Silva");
    await user.clear(name);
    await user.type(name, "Ana Souza");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(await screen.findByText("Detalhes atualizados")).toBeInTheDocument();
    expect(usersApi.update).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ name: "Ana Souza" }),
    );
  });

  it("shows a loading error", async () => {
    vi.mocked(usersApi.get).mockRejectedValue(new Error("offline"));
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar",
    );
  });
});
