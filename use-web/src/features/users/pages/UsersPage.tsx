import { Plus, RefreshCw, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Alert } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { ApiError } from "../../../lib/api";
import { usersApi } from "../api/users.api";
import { DeleteUserDialog } from "../components/DeleteUserDialog";
import { UserCard } from "../components/UserCard";
import { UserTable } from "../components/UserTable";
import type { User } from "../types/user.types";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await usersApi.list());
    } catch {
      setError(
        "Não foi possível carregar os usuários. Verifique a conexão e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function removeUser(user: User) {
    try {
      await usersApi.delete(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setSelected(null);
      toast.success("Usuário excluído com sucesso.");
    } catch (caught) {
      const message =
        caught instanceof ApiError && caught.status === 404
          ? "O usuário já não existe."
          : "Não foi possível excluir o usuário.";
      toast.error(message);
    }
  }

  return (
    <section aria-labelledby="users-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Painel administrativo
          </p>
          <h1
            id="users-title"
            className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
          >
            Gerenciamento de usuários
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Cadastre, consulte e mantenha os usuários da aplicação em um só
            lugar.
          </p>
        </div>
        <Link to="/users/new">
          <Button className="w-full sm:w-auto">
            <Plus className="size-4" />
            Novo usuário
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <div aria-label="Carregando usuários" className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : error ? (
          <Alert>
            <p>{error}</p>
            <Button
              className="mt-3"
              variant="secondary"
              onClick={() => void loadUsers()}
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </Alert>
        ) : users.length === 0 ? (
          <Card className="p-8 text-center sm:p-12">
            <Users className="mx-auto size-10 text-slate-400" />
            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Nenhum usuário cadastrado
            </h2>
            <p className="mt-2 text-slate-600">
              Crie o primeiro usuário para começar.
            </p>
            <Link className="mt-5 inline-flex" to="/users/new">
              <Button>
                <Plus className="size-4" />
                Criar usuário
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="grid gap-3 md:hidden">
              {users.map((user) => (
                <UserCard key={user.id} user={user} onDelete={setSelected} />
              ))}
            </div>
            <div className="hidden md:block">
              <UserTable users={users} onDelete={setSelected} />
            </div>
          </>
        )}
      </div>
      <DeleteUserDialog
        user={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        onConfirm={removeUser}
      />
    </section>
  );
}
