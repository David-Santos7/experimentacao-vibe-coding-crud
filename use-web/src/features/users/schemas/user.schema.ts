import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail.")
    .email("Informe um e-mail válido."),
  role: z.enum(["USER", "ADMIN"], { error: "Selecione uma role válida." }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
