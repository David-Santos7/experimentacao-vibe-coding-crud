import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Alert } from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { ApiError } from "../../../lib/api";
import { usersApi } from "../api/users.api";
import type { User } from "../types/user.types";

export function UserDetailsPage() {
  const { id = "" } = useParams();
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

  if (loading)
    return (
      <div
        aria-label="Carregando usuário"
        className="mx-auto max-w-2xl space-y-4"
      >
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-72" />
      </div>
    );

  return (
    <section className="mx-auto max-w-2xl">
      <Link to="/users">
        <Button variant="ghost" className="-ml-3">
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      </Link>
      {error || !user ? (
        <Alert className="mt-6">{error ?? "Usuário não encontrado."}</Alert>
      ) : (
        <Card className="mt-5 overflow-hidden">
          <div className="border-b border-slate-200 p-5 sm:flex sm:items-start sm:justify-between sm:p-7">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-950">
                  {user.name}
                </h1>
                <Badge role={user.role} />
              </div>
              <p className="mt-2 text-sm text-slate-500">ID: {user.id}</p>
            </div>
            <Link
              className="mt-4 inline-flex sm:mt-0"
              to={`/users/${user.id}/edit`}
            >
              <Button variant="secondary">
                <Pencil className="size-4" />
                Editar
              </Button>
            </Link>
          </div>
          <dl className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Mail className="size-4" />
                E-mail
              </dt>
              <dd className="mt-1 text-slate-950">{user.email}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <ShieldCheck className="size-4" />
                Role
              </dt>
              <dd className="mt-1 text-slate-950">{user.role}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <CalendarDays className="size-4" />
                Criado em
              </dt>
              <dd className="mt-1 text-slate-950">
                {new Date(user.createdAt).toLocaleString("pt-BR")}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <CalendarDays className="size-4" />
                Atualizado em
              </dt>
              <dd className="mt-1 text-slate-950">
                {new Date(user.updatedAt).toLocaleString("pt-BR")}
              </dd>
            </div>
          </dl>
        </Card>
      )}
    </section>
  );
}
