import * as React from "react"
import { cn } from "../lib/cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground motion-base outline-hidden placeholder:text-muted-foreground focus-visible:border-focus focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--focus)_25%,transparent)] aria-invalid:border-danger is-disabled:cursor-not-allowed is-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
