"use client";

import { useItemState } from "@tomato/grid";
import { CanvasWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionCanvas } from "../session/session-canvas";
import { SessionProvider } from "../session/session-provider";

export function EditorCanvasWidgetItem({ widget }: FieldComponentProps) {
  const sessionId = widget.session?.id;
  const { isDragging } = useItemState();

  return (
    <CanvasWidgetItem widget={widget}>
      {(columnWidth) =>
        sessionId && (
          <SessionProvider sessionId={sessionId}>
            <SessionCanvas isNested columnWidth={columnWidth} isDisabled={isDragging} />
          </SessionProvider>
        )
      }
    </CanvasWidgetItem>
  );
}
