import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-full border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:outline-danger",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
