"use client";

import type { Session, Widget } from "@/shared/types/template.types";
import { ScrollArea, cn } from "@tomato/ui";
import { useMemo } from "react";
import * as R from "remeda";
import { DEFAULT_LAYOUT, EditorIcon, WidgetItems, getContentSessions } from "@/modules/template-widget";
import { useTemplateState } from "../../../hooks/use-template-state";
import { useTemplateStateBaseSessions } from "../../../hooks/use-template-state-base-sessions";
import { useWidgetSelection } from "../../provider/template-provider";

interface WidgetEntry {
  widget: Widget;
  nested: SessionThumbnail[];
}

interface SessionThumbnail {
  session: Session;
  widgets: WidgetEntry[];
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

/** A container's widgets (its content sessions) are listed under it, indented; a mixed view's under each tab name. */
function WidgetEntryList({ entries, className }: { entries: WidgetEntry[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {entries.map(({ widget, nested }) => (
        <div key={widget.id} className="flex flex-col gap-1">
          <WidgetRow widget={widget} />
          {nested.map((content) => (
            <div key={content.session.id} className="ml-4 flex flex-col gap-1">
              {widget.tabs && <p className="truncate px-3 text-xs text-muted-foreground">{content.session.name}</p>}
              {content.widgets.length > 0 && <WidgetEntryList entries={content.widgets} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SessionGroup({ entry }: { entry: SessionThumbnail }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="truncate text-sm font-medium">{entry.session.name}</p>
      {entry.widgets.length === 0 ? (
        <p className="px-3 py-1 text-xs text-muted-foreground">No fields in this section</p>
      ) : (
        <WidgetEntryList entries={entry.widgets} />
      )}
    </div>
  );
}

export function StructureToolbarBox() {
  const { sessions, widgets, widgetToSession, layouts } = useTemplateState();
  const baseSessions = useTemplateStateBaseSessions();

  const tree = useMemo<SessionThumbnail[]>(() => {
    const sessionWidgets = (sessionId: string) =>
      R.pipe(
        widgetToSession,
        R.entries(),
        R.filter(([, id]) => id === sessionId),
        R.sortBy(([widgetId]) => (layouts[widgetId] ?? DEFAULT_LAYOUT).idx),
        R.map(([widgetId]) => widgets[widgetId]),
        R.filter((widget): widget is Widget => widget !== undefined),
      );

    const toThumbnail = (session: Session): SessionThumbnail => ({
      session,
      widgets: sessionWidgets(session.id).map((widget) => ({
        widget,
        nested: getContentSessions(widget).map(toThumbnail),
      })),
    });

    return baseSessions.map(toThumbnail);
  }, [baseSessions, sessions, widgets, widgetToSession, layouts]);

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
