"use client";

import type { Session } from "@/shared/types/template.types";
import { SessionFrame } from "@/shared/components/session-frame";
import { DEFAULT_SESSION_ICON, EditorIcon } from "@/modules/template-widget";
import { FormSessionGrid } from "./form-session-grid";

import { Typography } from "@tomato/ui";
interface FormSessionBoxProps {
  session: Session;
}

export function FormSessionBox({ session }: FormSessionBoxProps) {
  return (
    <SessionFrame
      header={
        <>
          <EditorIcon icon={session.icon ?? DEFAULT_SESSION_ICON} className="size-3.5 shrink-0" />
          <Typography as="p" className="truncate py-0.5 font-medium">{session.name}</Typography>
        </>
      }
    >
      <FormSessionGrid sessionId={session.id} />
    </SessionFrame>
  );
}
