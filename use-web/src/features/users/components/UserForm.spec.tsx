import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { UserForm } from "./UserForm";

describe("UserForm", () => {
  it("shows validation messages", async () => {
    const user = userEvent.setup();
    render(<UserForm submitLabel="Criar usuário" onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Criar usuário" }));

    expect(await screen.findByText("Informe o nome.")).toBeInTheDocument();
    expect(screen.getByText("Informe o e-mail.")).toBeInTheDocument();
  });

  it("submits valid normalized values and disables during submission", async () => {
    const user = userEvent.setup();
    let resolveSubmit!: () => void;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );
    render(<UserForm submitLabel="Criar usuário" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nome"), "Ana Silva");
    await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
    await user.selectOptions(screen.getByLabelText("Role"), "ADMIN");
    await user.click(screen.getByRole("button", { name: "Criar usuário" }));

    expect(onSubmit).toHaveBeenCalledWith(
      { name: "Ana Silva", email: "ana@example.com", role: "ADMIN" },
      expect.anything(),
    );
    expect(screen.getByRole("button", { name: "Salvando..." })).toBeDisabled();
    resolveSubmit();
  });
});
