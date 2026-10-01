import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import type { User } from "../types/user.types";

export function UserCard({
  user,
  onDelete,
}: {
  user: User;
  onDelete: (user: User) => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-slate-950">{user.name}</h2>
          <p className="truncate text-sm text-slate-600">{user.email}</p>
        </div>
        <Badge role={user.role} />
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Criado em{" "}
        {new Intl.DateTimeFormat("pt-BR").format(new Date(user.createdAt))}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Link className="inline-flex" to={`/users/${user.id}`}>
          <Button
            className="w-full px-2"
            variant="ghost"
            aria-label={`Visualizar ${user.name}`}
          >
            <Eye className="size-4" />
          </Button>
        </Link>
        <Link className="inline-flex" to={`/users/${user.id}/edit`}>
          <Button
            className="w-full px-2"
            variant="ghost"
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
    </Card>
  );
}
