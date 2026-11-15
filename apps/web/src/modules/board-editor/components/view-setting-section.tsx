"use client";

import { Typography } from "@tomato/ui";
import type { ReactNode } from "react";

interface ViewSettingSectionProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export function ViewSettingSection({ title, description, actions, children }: ViewSettingSectionProps) {
  return (
    <section className="flex flex-col gap-3" aria-label={title}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Typography as="h2" className="font-medium">{title}</Typography>
          <Typography as="p" className="text-sm text-muted-foreground">{description}</Typography>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      {children}
    </section>
  );
}
