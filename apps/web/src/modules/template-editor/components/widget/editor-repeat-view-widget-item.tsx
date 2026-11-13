"use client";

import { useItemState } from "@tomato/grid";
import { RepeatViewWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionGrid } from "../session/session-grid";
import { SessionIdProvider } from "../provider/session-id-provider";

export function EditorRepeatViewWidgetItem({ widget }: FieldComponentProps) {
  const { isDragging } = useItemState();
  const sessionId = widget.session?.id;

  return (
    <RepeatViewWidgetItem widget={widget}>
      {(_, columnWidth) =>
        sessionId && (
          <SessionIdProvider sessionId={sessionId}>
            <SessionGrid isNested columnWidth={columnWidth} isDisabled={isDragging} />
          </SessionIdProvider>
        )
      }
    </RepeatViewWidgetItem>
  );
}
