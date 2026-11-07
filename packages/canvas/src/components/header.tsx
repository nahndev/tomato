import { cn } from "@tomato/ui";
import type { ReactNode } from "react";

interface HeaderProps {
  /** Placed at the start, e.g. a back link and the title. */
  leading?: ReactNode;
  /** Placed at the end, e.g. an `CanvasToolbar`. */
  children?: ReactNode;
  className?: string;
}

export function Header({ leading, children, className }: HeaderProps) {
  return (
    <header
      className={cn("flex items-center gap-3 border-b border-border bg-card px-4 py-2 text-foreground", className)}
    >
      {leading}
      <div className="flex-1" />
      {children}
    </header>
  );
}
