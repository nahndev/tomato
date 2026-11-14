"use client";

import { CanvasWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionFormGrid } from "../session-form-grid";

export function FormCanvasWidgetItem({ widget }: FieldComponentProps) {
  const sessionId = widget.session?.id;
  return (
    <CanvasWidgetItem widget={widget}>
      {(columnWidth) => sessionId && <SessionFormGrid sessionId={sessionId} isNested columnWidth={columnWidth} />}
    </CanvasWidgetItem>
  );
}
