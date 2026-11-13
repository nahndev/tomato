"use client";

import { CanvasWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { FormSessionGrid } from "../form-session-grid";

export function FormCanvasWidgetItem({ widget }: FieldComponentProps) {
  const sessionId = widget.session?.id;
  return (
    <CanvasWidgetItem widget={widget}>
      {(columnWidth) => sessionId && <FormSessionGrid sessionId={sessionId} isNested columnWidth={columnWidth} />}
    </CanvasWidgetItem>
  );
}
