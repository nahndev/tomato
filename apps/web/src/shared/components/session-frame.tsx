import type { ReactNode } from "react";

interface SessionFrameProps {
  header: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export function SessionFrame({ header, actions, children }: SessionFrameProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 px-1 text-sm text-muted-foreground">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">{header}</div>
          {actions}
        </div>
        <div className="rounded-lg bg-card p-4 text-foreground shadow-card">{children}</div>
      </div>
    </div>
  );
}
