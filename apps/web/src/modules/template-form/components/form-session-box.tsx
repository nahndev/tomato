"use client";

import type { Session } from "@/shared/types/template.types";
import { EditorIcon } from "@/modules/template-widget";
import { FormSessionGrid } from "./form-session-grid";

interface FormSessionBoxProps {
  session: Session;
}

export function FormSessionBox({ session }: FormSessionBoxProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg bg-card p-4 text-foreground shadow-card">
        <div className="flex items-center gap-2 border-b border-border p-2">
          <EditorIcon icon={session.icon} className="size-4 text-muted-foreground" />
          <p className="font-medium">{session.name}</p>
        </div>
        <FormSessionGrid sessionId={session.id} />
      </div>
    </div>
  );
}
