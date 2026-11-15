"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { BackButton } from "@/shared/components/back-button";
import { SubmissionGraph } from "./submission-graph";

interface SubmissionLayoutProps {
  children: ReactNode;
}

export function SubmissionLayout({ children }: SubmissionLayoutProps) {
  const { id } = useParams<{ id?: string }>();

  return (
    <div className="grid h-screen grid-cols-[16rem_1fr] overflow-hidden bg-canvas">
      <aside className="flex min-h-0 flex-col border-r border-border bg-card text-foreground">
        <div className="flex h-14 shrink-0 items-center border-b border-border px-2">
          <BackButton fallbackHref="/system/boards" label="Back to boards" />
        </div>
        {id && <SubmissionGraph value={id} />}
      </aside>
      <div className="min-h-0 min-w-0">{children}</div>
    </div>
  );
}
