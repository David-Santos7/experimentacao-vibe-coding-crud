export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

export type UpdateUserInput = Partial<CreateUserInput>;

export interface ApiErrorBody {
  error: string;
  message: string;
}
