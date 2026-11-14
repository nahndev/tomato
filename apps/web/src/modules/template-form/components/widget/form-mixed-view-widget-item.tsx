"use client";

import { DataScopeProvider } from "@/modules/template-data";
import { MixedViewWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionFormGrid } from "../session-form-grid";

export function FormMixedViewWidgetItem({ widget }: FieldComponentProps) {
  return (
    <MixedViewWidgetItem widget={widget} isAllMounted>
      {(session, columnWidth) => (
        <DataScopeProvider scope={[widget.id, session.id]}>
          <SessionFormGrid sessionId={session.id} isNested columnWidth={columnWidth} />
        </DataScopeProvider>
      )}
    </MixedViewWidgetItem>
  );
}
