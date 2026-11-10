"use client";

import type { Session, TemplateSnapshot } from "@tomato/types";
import { ContainerLayout } from "@tomato/grid";
import { useMemo } from "react";
import { pickBy } from "remeda";
import { EditorIcon } from "@/modules/template-widget";
import { FormField } from "./form-container";

interface FormSessionProps {
  session: Session;
  snapshot: TemplateSnapshot;
}

export function FormSession({ session, snapshot }: FormSessionProps) {
  const layouts = useMemo(
    () => pickBy(snapshot.layouts, (_, widgetId) => snapshot.widgetToSession[widgetId] === session.id),
    [snapshot.layouts, snapshot.widgetToSession, session.id],
  );

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg bg-card p-4 text-foreground shadow-card">
        <div className="flex items-center gap-2 border-b border-border p-2">
          <EditorIcon icon={session.icon} className="size-4 text-muted-foreground" />
          <p className="font-medium">{session.name}</p>
        </div>
        <ContainerLayout id={session.id} layouts={layouts} isDisabled>
          {(id: string) => {
            const widget = snapshot.widgets[id];
            return widget ? <FormField key={id} widget={widget} /> : null;
          }}
        </ContainerLayout>
      </div>
    </div>
  );
}
