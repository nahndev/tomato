"use client";

import type { Session } from "@/shared/types/template.types";
import { SessionFrame } from "@/shared/components/session-frame";
import { SessionValidationProvider } from "@/modules/template-data";
import { DEFAULT_SESSION_ICON, EditorIcon } from "@/modules/template-widget";
import { Typography } from "@tomato/ui";
import { SessionFormGrid } from "./session-form-grid";

interface SessionFormBoxProps {
  session: Session;
}

export function SessionFormBox({ session }: SessionFormBoxProps) {
  return (
    <SessionValidationProvider sessionId={session.id}>
      <SessionFrame
        header={
          <>
            <EditorIcon icon={session.icon ?? DEFAULT_SESSION_ICON} className="size-3.5 shrink-0" />
            <Typography as="p" className="truncate py-0.5 font-medium">{session.name}</Typography>
          </>
        }
      >
        <SessionFormGrid sessionId={session.id} />
      </SessionFrame>
    </SessionValidationProvider>
  );
}
