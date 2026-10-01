import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

const variants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue-700 text-white hover:bg-blue-800",
        secondary:
          "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
        danger: "bg-red-700 text-white hover:bg-red-800",
        ghost: "text-slate-700 hover:bg-slate-100",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variants>;

export function Button({ className, variant, ...props }: Props) {
  return <button className={cn(variants({ variant }), className)} {...props} />;
}
