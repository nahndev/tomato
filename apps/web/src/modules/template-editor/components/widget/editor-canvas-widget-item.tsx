"use client";

import { CanvasWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionCanvas } from "../session/session-canvas";
import { SessionProvider } from "../session/session-provider";

export function EditorCanvasWidgetItem({ widget }: FieldComponentProps) {
  const sessionId = widget.session?.id;

  return (
    <CanvasWidgetItem widget={widget}>
      {(columnWidth) =>
        sessionId && (
          <SessionProvider sessionId={sessionId}>
            <SessionCanvas isNested columnWidth={columnWidth} />
          </SessionProvider>
        )
      }
    </CanvasWidgetItem>
  );
}
