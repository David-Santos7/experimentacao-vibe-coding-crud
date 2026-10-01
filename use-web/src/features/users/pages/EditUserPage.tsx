import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Alert } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { ApiError } from "../../../lib/api";
import { usersApi } from "../api/users.api";
import { UserForm } from "../components/UserForm";
import type { UserFormValues } from "../schemas/user.schema";
import type { User } from "../types/user.types";

export function EditUserPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    usersApi
      .get(id)
      .then(setUser)
      .catch((caught) =>
        setError(
          caught instanceof ApiError && caught.status === 404
            ? "Usuário não encontrado."
            : "Não foi possível carregar o usuário.",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  async function submit(values: UserFormValues) {
    setError(null);
    try {
      await usersApi.update(id, values);
      toast.success("Usuário atualizado com sucesso.");
      navigate(`/users/${id}`);
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 409
          ? "Este e-mail já está em uso."
          : "Não foi possível atualizar o usuário.",
      );
    }
  }

  if (loading)
    return (
      <div
        aria-label="Carregando usuário"
        className="mx-auto max-w-2xl space-y-4"
      >
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-96" />
      </div>
    );

  return (
    <section className="mx-auto max-w-2xl">
      <Link to={user ? `/users/${user.id}` : "/users"}>
        <Button variant="ghost" className="-ml-3">
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-950">Editar usuário</h1>
      <p className="mt-2 text-slate-600">Atualize os dados cadastrais.</p>
      {user ? (
        <Card className="mt-6 p-5 sm:p-7">
          <UserForm
            submitLabel="Salvar alterações"
            serverError={error}
            defaultValues={{
              name: user.name,
              email: user.email,
              role: user.role,
            }}
            onSubmit={submit}
          />
        </Card>
      ) : (
        <Alert className="mt-6">{error ?? "Usuário não encontrado."}</Alert>
      )}
    </section>
  );
}
