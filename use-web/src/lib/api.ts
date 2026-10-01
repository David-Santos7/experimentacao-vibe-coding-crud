import type { ApiErrorBody } from "../features/users/types/user.types";

const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3333"
).replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    let body: ApiErrorBody = {
      error: "REQUEST_FAILED",
      message: "Não foi possível concluir a solicitação.",
    };
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // The fallback intentionally hides non-JSON server details.
    }
    throw new ApiError(response.status, body.error, body.message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
