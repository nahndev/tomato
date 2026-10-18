"use client";

import type { Session, Widget } from "@tomato/types";
import { ScrollArea, cn } from "@tomato/ui";
import { useMemo } from "react";
import * as R from "remeda";
import { WidgetItems } from "../../../constants/widget-items.constants";
import { DEFAULT_LAYOUT } from "../../../constants/widget-layouts.constants";
import { useTemplateState } from "../../../hooks/use-template-state";
import { EditorIcon } from "../../editor-icon";
import { useWidgetSelection } from "../../provider/template-provider";

interface SessionThumbnail {
  session: Session;
  widgets: Widget[];
}

function WidgetRow({ widget }: { widget: Widget }) {
  const { isSelected, select } = useWidgetSelection();

  return (
    <button
      type="button"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm motion-base hover:bg-muted focus-ring",
        isSelected(widget) && "bg-primary text-primary-foreground hover:bg-primary",
      )}
      onClick={() => select(widget)}
    >
      <EditorIcon icon={WidgetItems[widget.type].icon} className="size-3.5 shrink-0" />
      <span className="truncate">{widget.label || "(no label)"}</span>
    </button>
  );
}

function SessionGroup({ entry }: { entry: SessionThumbnail }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="truncate text-sm font-medium">{entry.session.name}</p>
      {entry.widgets.length === 0 ? (
        <p className="px-3 py-1 text-xs text-muted-foreground">No fields in this section</p>
      ) : (
        <div className="flex flex-col gap-1">
          {entry.widgets.map((widget) => (
            <WidgetRow key={widget.id} widget={widget} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StructureToolbarBox() {
  const { sessions, widgets, widgetToSession, layouts } = useTemplateState();

  const tree = useMemo<SessionThumbnail[]>(
    () =>
      R.values(sessions).map((session) => ({
        session,
        widgets: R.pipe(
          widgetToSession,
          R.entries(),
          R.filter(([, sessionId]) => sessionId === session.id),
          R.sortBy(([widgetId]) => (layouts[widgetId] ?? DEFAULT_LAYOUT).idx),
          R.map(([widgetId]) => widgets[widgetId]),
          R.filter((widget): widget is Widget => widget !== undefined),
        ),
      })),
    [sessions, widgets, widgetToSession, layouts],
  );

  return (
    <ScrollArea className="p-2 pb-0">
      {tree.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No sections yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {tree.map((entry) => (
            <SessionGroup key={entry.session.id} entry={entry} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
