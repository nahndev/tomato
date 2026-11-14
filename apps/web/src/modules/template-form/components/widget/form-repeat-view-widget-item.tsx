"use client";

import { DataScopeProvider } from "@/modules/template-data";
import { RepeatViewWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionFormGrid } from "../session-form-grid";

export function FormRepeatViewWidgetItem({ widget }: FieldComponentProps) {
  const sessionId = widget.session?.id;
  return (
    <RepeatViewWidgetItem widget={widget} isAllMounted>
      {(tab, columnWidth) =>
        sessionId && (
          <DataScopeProvider scope={[widget.id, tab.id]}>
            <SessionFormGrid sessionId={sessionId} isNested columnWidth={columnWidth} />
          </DataScopeProvider>
        )
      }
    </RepeatViewWidgetItem>
  );
}
