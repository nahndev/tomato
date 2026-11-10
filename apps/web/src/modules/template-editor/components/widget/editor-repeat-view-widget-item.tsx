"use client";

import { useItemState } from "@tomato/grid";
import { RepeatViewWidgetItem, type FieldComponentProps } from "@/modules/template-widget";
import { SessionCanvas } from "../session/session-canvas";
import { SessionProvider } from "../session/session-provider";

export function EditorRepeatViewWidgetItem({ widget }: FieldComponentProps) {
  const { isDragging } = useItemState();
  const sessionId = widget.session?.id;

  return (
    <RepeatViewWidgetItem widget={widget}>
      {(_, columnWidth) =>
        sessionId && (
          <SessionProvider sessionId={sessionId}>
            <SessionCanvas isNested columnWidth={columnWidth} isDisabled={isDragging} />
          </SessionProvider>
        )
      }
    </RepeatViewWidgetItem>
  );
}
