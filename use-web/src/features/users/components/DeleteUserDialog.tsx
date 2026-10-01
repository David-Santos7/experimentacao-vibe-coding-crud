import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, X } from "lucide-react";
import { useState } from "react";

import { Button } from "../../../components/ui/button";
import type { User } from "../types/user.types";

interface Props {
  user: User | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: User) => Promise<void>;
}

export function DeleteUserDialog({ user, onOpenChange, onConfirm }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function confirm() {
    if (!user) return;
    setDeleting(true);
    try {
      await onConfirm(user);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog.Root open={Boolean(user)} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/45" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-bold text-slate-950">
                Excluir usuário?
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-6 text-slate-600">
                Esta ação excluirá permanentemente <strong>{user?.name}</strong>{" "}
                ({user?.email}).
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                className="min-h-10 px-2"
                aria-label="Fechar diálogo"
              >
                <X className="size-5" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="secondary" disabled={deleting}>
                Cancelar
              </Button>
            </Dialog.Close>
            <Button variant="danger" disabled={deleting} onClick={confirm}>
              {deleting ? (
                <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
              ) : null}
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
