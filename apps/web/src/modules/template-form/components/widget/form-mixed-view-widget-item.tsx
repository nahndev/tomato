"use client";

import { DataScopeProvider } from "@/modules/template-data";
import { MixedViewWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { FormSessionGrid } from "../form-session-grid";

export function FormMixedViewWidgetItem({ widget }: FieldComponentProps) {
  return (
    <MixedViewWidgetItem widget={widget} isAllMounted>
      {(session, columnWidth) => (
        <DataScopeProvider scope={[widget.id, session.id]}>
          <FormSessionGrid sessionId={session.id} isNested columnWidth={columnWidth} />
        </DataScopeProvider>
      )}
    </MixedViewWidgetItem>
  );
}
