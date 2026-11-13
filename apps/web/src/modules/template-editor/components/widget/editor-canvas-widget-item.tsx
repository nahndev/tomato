"use client";

import { useItemState } from "@tomato/grid";
import { CanvasWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionGrid } from "../session/session-grid";
import { SessionIdProvider } from "../session/session-id-provider";

export function EditorCanvasWidgetItem({ widget }: FieldComponentProps) {
  const sessionId = widget.session?.id;
  const { isDragging } = useItemState();

  return (
    <CanvasWidgetItem widget={widget}>
      {(columnWidth) =>
        sessionId && (
          <SessionIdProvider sessionId={sessionId}>
            <SessionGrid isNested columnWidth={columnWidth} isDisabled={isDragging} />
          </SessionIdProvider>
        )
      }
    </CanvasWidgetItem>
  );
}
