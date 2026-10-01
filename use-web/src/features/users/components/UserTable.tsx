import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import type { User } from "../types/user.types";

export function UserTable({
  users,
  onDelete,
}: {
  users: User[];
  onDelete: (user: User) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase">
          <tr>
            <th className="px-5 py-3">Nome</th>
            <th className="px-5 py-3">E-mail</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Criação</th>
            <th className="px-5 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50">
              <td className="px-5 py-4 font-medium text-slate-950">
                {user.name}
              </td>
              <td className="px-5 py-4 text-slate-600">{user.email}</td>
              <td className="px-5 py-4">
                <Badge role={user.role} />
              </td>
              <td className="px-5 py-4 text-slate-600">
                {new Intl.DateTimeFormat("pt-BR").format(
                  new Date(user.createdAt),
                )}
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  <Link to={`/users/${user.id}`}>
                    <Button
                      variant="ghost"
                      className="px-2"
                      aria-label={`Visualizar ${user.name}`}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </Link>
                  <Link to={`/users/${user.id}/edit`}>
                    <Button
                      variant="ghost"
                      className="px-2"
                      aria-label={`Editar ${user.name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="px-2 text-red-700"
                    onClick={() => onDelete(user)}
                    aria-label={`Excluir ${user.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
