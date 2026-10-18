import { TemplateDocKey } from "@tomato/constants";
import { LayoutIdx } from "@tomato/grid";
import type { GridLayout } from "@tomato/types";
import { generateKeyBetween } from "fractional-indexing";
import { OnSyncEvent, SyncHandler, type SyncDoc } from "@/shared/lib/sync";
import { WidgetItems } from "../../constants/widget-items.constants";
import { DEFAULT_LAYOUT } from "../../constants/widget-layouts.constants";
import { LayoutUpdatedEvent, WidgetAddedEvent, WidgetRemovedEvent } from "../sync.events";
import { SessionHandler } from "./session-handler";

export type WidgetPosition = "first" | "last" | { after: string };

export interface WidgetPlacement {
  layout?: Partial<Pick<GridLayout, "column" | "span" | "isFullWidth">>;
  sessionId?: string;
  position?: WidgetPosition;
}

@SyncHandler()
export class LayoutHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get layouts() {
    return this.syncDoc.doc.getMap<GridLayout>(TemplateDocKey.LAYOUTS);
  }

  private get widgetToSession() {
    return this.syncDoc.doc.getMap<string>(TemplateDocKey.WIDGET_TO_SESSION);
  }

  getLayout(widgetId: string): GridLayout | undefined {
    return this.layouts.get(widgetId);
  }

  getSessionId(widgetId: string): string | undefined {
    return this.widgetToSession.get(widgetId);
  }

  getWidgetIdsForSession(sessionId: string): string[] {
    return Array.from(this.widgetToSession.entries())
      .filter(([, id]) => id === sessionId)
      .map(([widgetId]) => widgetId);
  }

  setLayout(widgetId: string, sessionId: string, patch: Partial<GridLayout>): void {
    const current = this.layouts.get(widgetId) ?? DEFAULT_LAYOUT;
    this.layouts.set(widgetId, { ...current, ...patch });
    this.widgetToSession.set(widgetId, sessionId);
    this.syncDoc.emit(new LayoutUpdatedEvent(widgetId, sessionId));
  }

  placeWidget(widgetId: string, placement: WidgetPlacement): void {
    const current = this.layouts.get(widgetId);
    const currentSessionId = this.widgetToSession.get(widgetId);
    if (!current || !currentSessionId) return;

    const sessionId = placement.sessionId ?? currentSessionId;
    const idx = placement.position ? this.getIdxAt(widgetId, placement.position) : current.idx;
    this.layouts.set(widgetId, { ...current, ...placement.layout, idx });
    this.widgetToSession.set(widgetId, sessionId);
    this.syncDoc.emit(new LayoutUpdatedEvent(widgetId, sessionId));
  }

  private getIdxAt(widgetId: string, position: WidgetPosition): string {
    const others = Object.fromEntries(Array.from(this.layouts.entries()).filter(([id]) => id !== widgetId));
    if (position === "first") {
      const firstIdx = Object.values(others)
        .map((layout) => layout.idx)
        .sort()[0];
      return generateKeyBetween(null, firstIdx ?? null);
    }
    if (position === "last") return LayoutIdx.getInsertIdx(others, null);
    return LayoutIdx.getInsertIdx(others, { id: position.after });
  }

  @OnSyncEvent(WidgetAddedEvent)
  onWidgetAdded(event: WidgetAddedEvent): void {
    const { widget, before } = event;
    const layout: GridLayout = {
      ...WidgetItems[widget.type].defaultLayout,
      idx: LayoutIdx.getInsertIdx(Object.fromEntries(this.layouts.entries()), before),
    };
    this.layouts.set(widget.id, layout);

    const beforeSessionId = before && this.widgetToSession.get(before.id);
    const sessionId = beforeSessionId ?? this.syncDoc.getHandler(SessionHandler).getOrCreateDefaultSessionId();
    this.widgetToSession.set(widget.id, sessionId);
  }

  @OnSyncEvent(WidgetRemovedEvent)
  onWidgetRemoved(event: WidgetRemovedEvent): void {
    this.layouts.delete(event.widgetId);
    this.widgetToSession.delete(event.widgetId);
  }
}
