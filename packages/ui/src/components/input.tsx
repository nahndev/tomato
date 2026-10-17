import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground motion-base placeholder:text-muted-foreground enabled:hover:border-[color-mix(in_oklab,var(--input)_70%,var(--foreground))] focus-visible:border-focus focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--focus)_25%,transparent)] focus-visible:outline-hidden aria-invalid:border-danger aria-invalid:focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--danger)_25%,transparent)] is-disabled:cursor-not-allowed is-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
