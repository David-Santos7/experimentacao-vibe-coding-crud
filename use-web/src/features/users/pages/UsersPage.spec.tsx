import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usersApi } from "../api/users.api";
import type { User } from "../types/user.types";
import { UsersPage } from "./UsersPage";

vi.mock("../api/users.api", () => ({
  usersApi: { list: vi.fn(), delete: vi.fn() },
}));

const ana: User = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Ana Silva",
  email: "ana@example.com",
  role: "USER",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderPage() {
  return render(
    <MemoryRouter>
      <UsersPage />
    </MemoryRouter>,
  );
}

describe("UsersPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows loading", () => {
    vi.mocked(usersApi.list).mockReturnValue(new Promise(() => undefined));
    renderPage();
    expect(screen.getByLabelText("Carregando usuários")).toBeInTheDocument();
  });

  it("shows the users list", async () => {
    vi.mocked(usersApi.list).mockResolvedValue([ana]);
    renderPage();
    expect(await screen.findAllByText("Ana Silva")).not.toHaveLength(0);
  });

  it("shows the empty state", async () => {
    vi.mocked(usersApi.list).mockResolvedValue([]);
    renderPage();
    expect(
      await screen.findByText("Nenhum usuário cadastrado"),
    ).toBeInTheDocument();
  });

  it("shows an error state", async () => {
    vi.mocked(usersApi.list).mockRejectedValue(new Error("offline"));
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar",
    );
  });

  it("confirms, cancels and completes deletion", async () => {
    const user = userEvent.setup();
    vi.mocked(usersApi.list).mockResolvedValue([ana]);
    vi.mocked(usersApi.delete).mockResolvedValue(undefined);
    renderPage();

    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: "Excluir Ana Silva" }),
      ).not.toHaveLength(0),
    );
    await user.click(
      screen.getAllByRole("button", { name: "Excluir Ana Silva" })[0]!,
    );
    expect(screen.getByRole("dialog")).toHaveTextContent("ana@example.com");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", { name: "Excluir Ana Silva" })[0]!,
    );
    await user.click(screen.getByRole("button", { name: /^Excluir$/ }));
    await waitFor(() => expect(usersApi.delete).toHaveBeenCalledWith(ana.id));
    expect(screen.queryByText("Ana Silva")).not.toBeInTheDocument();
  });
});
