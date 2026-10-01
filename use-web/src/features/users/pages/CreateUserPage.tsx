import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { ApiError } from "../../../lib/api";
import { usersApi } from "../api/users.api";
import { UserForm } from "../components/UserForm";
import type { UserFormValues } from "../schemas/user.schema";

export function CreateUserPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function submit(values: UserFormValues) {
    setError(null);
    try {
      const user = await usersApi.create(values);
      toast.success("Usuário criado com sucesso.");
      navigate(`/users/${user.id}`);
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 409
          ? "Este e-mail já está em uso."
          : "Não foi possível criar o usuário. Tente novamente.",
      );
    }
  }

  return (
    <section className="mx-auto max-w-2xl">
      <Link to="/users">
        <Button variant="ghost" className="-ml-3">
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-950">Novo usuário</h1>
      <p className="mt-2 text-slate-600">
        Preencha os dados para cadastrar um usuário.
      </p>
      <Card className="mt-6 p-5 sm:p-7">
        <UserForm
          submitLabel="Criar usuário"
          serverError={error}
          onSubmit={submit}
        />
      </Card>
    </section>
  );
}
