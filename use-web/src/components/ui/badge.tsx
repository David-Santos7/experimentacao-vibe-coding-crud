import type { UserRole } from "../../features/users/types/user.types";

export function Badge({ role }: { role: UserRole }) {
  const colors =
    role === "ADMIN"
      ? "bg-violet-100 text-violet-800"
      : "bg-blue-100 text-blue-800";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${colors}`}
    >
      {role}
    </span>
  );
}
