import type { ReactNode } from "react";

interface FileBrowserStateProps {
  icon: ReactNode;
  title: string;
  action?: ReactNode;
  isAlert?: boolean;
}

/** Fills the tree area when there are no rows to show. */
export function FileBrowserState({
  icon,
  title,
  action,
  isAlert = false,
}: FileBrowserStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">
        {icon}
      </span>
      <p
        role={isAlert ? "alert" : undefined}
        className="text-sm text-muted-foreground"
      >
        {title}
      </p>
      {action}
    </div>
  );
}
