"use client";

import { Button } from "@tomato/ui";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
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
          <Button asChild variant="ghost" size="icon" aria-label="Back to boards">
            <Link href="/system/boards">
              <ArrowLeftIcon />
            </Link>
          </Button>
        </div>
        {id && <SubmissionGraph value={id} />}
      </aside>
      <div className="min-h-0 min-w-0">{children}</div>
    </div>
  );
}
