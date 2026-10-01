import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { userFormSchema, type UserFormValues } from "../schemas/user.schema";

interface Props {
  defaultValues?: UserFormValues;
  submitLabel: string;
  serverError?: string | null;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

export function UserForm({
  defaultValues,
  submitLabel,
  serverError,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultValues ?? { name: "", email: "", role: "USER" },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError ? <Alert>{serverError}</Alert> : null}

      <div>
        <label
          className="mb-1.5 block text-sm font-semibold text-slate-800"
          htmlFor="name"
        >
          Nome
        </label>
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <p id="name-error" className="mt-1 text-sm text-red-700">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="mb-1.5 block text-sm font-semibold text-slate-800"
          htmlFor="email"
        >
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="mt-1 text-sm text-red-700">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="mb-1.5 block text-sm font-semibold text-slate-800"
          htmlFor="role"
        >
          Role
        </label>
        <Select
          id="role"
          aria-describedby={errors.role ? "role-error" : undefined}
          {...register("role")}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </Select>
        {errors.role ? (
          <p id="role-error" className="mt-1 text-sm text-red-700">
            {errors.role.message}
          </p>
        ) : null}
      </div>

      <Button
        className="w-full sm:w-auto"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
        ) : null}
        {isSubmitting ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
