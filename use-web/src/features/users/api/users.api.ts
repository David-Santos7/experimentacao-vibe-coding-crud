import { apiRequest } from "../../../lib/api";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "../types/user.types";

export const usersApi = {
  list: () => apiRequest<User[]>("/users"),
  get: (id: string) => apiRequest<User>(`/users/${id}`),
  create: (input: CreateUserInput) =>
    apiRequest<User>("/users", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: UpdateUserInput) =>
    apiRequest<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/users/${id}`, { method: "DELETE" }),
};
