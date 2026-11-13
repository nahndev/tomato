"use client";

import type { Session } from "@/shared/types/template.types";
import { SessionFrame } from "@/shared/components/session-frame";
import { DEFAULT_SESSION_ICON, EditorIcon } from "@/modules/template-widget";
import { FormSessionGrid } from "./form-session-grid";

interface FormSessionBoxProps {
  session: Session;
}

export function FormSessionBox({ session }: FormSessionBoxProps) {
  return (
    <SessionFrame
      header={
        <>
          <EditorIcon icon={session.icon ?? DEFAULT_SESSION_ICON} className="size-3.5 shrink-0" />
          <p className="truncate py-0.5 font-medium">{session.name}</p>
        </>
      }
    >
      <FormSessionGrid sessionId={session.id} />
    </SessionFrame>
  );
}
