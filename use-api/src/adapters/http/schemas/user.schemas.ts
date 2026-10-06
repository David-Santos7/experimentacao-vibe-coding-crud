import { z } from "zod";

export const userIdSchema = z.object({
  id: z.uuid(),
});

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().optional(),
    role: z.string().optional(),
  })
  .refine(
    (input) =>
      input.name !== undefined ||
      input.email !== undefined ||
      input.role !== undefined,
    { message: "At least one field must be provided." },
  );
