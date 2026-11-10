import { TemplateDocKey, WidgetType } from "@tomato/constants";
import type { Widget, WidgetProperties } from "@tomato/types";
import { SyncHandler, type SyncDoc } from "@/shared/lib/sync";
import { WidgetItems, createContentSession, getContentSessions } from "@/modules/template-widget";
import { DEFAULT_TAB_NAMES } from "../../template-editor.constants";
import { WidgetAddedEvent, WidgetPropertyChangedEvent, WidgetRemovedEvent } from "../sync.events";
import { LayoutHandler } from "./layout-handler";

@SyncHandler()
export class WidgetHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get widgets() {
    return this.syncDoc.doc.getMap<Widget>(TemplateDocKey.WIDGETS);
  }

  getWidget(id: string): Widget | undefined {
    return this.widgets.get(id);
  }

  addWidget(id: Widget["id"], type: WidgetType, before: Widget | null): void {
    const widget: Widget = { id, type, ...WidgetItems[type].defaultSettings };
    if (type === WidgetType.CANVAS) widget.session = createContentSession(id, widget.label);
    if (type === WidgetType.MIXED_VIEW) widget.tabs = DEFAULT_TAB_NAMES.map((name) => createContentSession(id, name));
    this.widgets.set(id, widget);
    this.syncDoc.emit(new WidgetAddedEvent(widget, before));
  }

  /** Removing a container also removes the widgets in its content sessions. */
  removeWidget(widgetId: string): void {
    const widget = this.widgets.get(widgetId);
    if (!widget) return;
    this.widgets.delete(widgetId);
    this.syncDoc.emit(new WidgetRemovedEvent(widgetId));

    getContentSessions(widget).forEach((session) => this.removeSessionWidgets(session.id));
  }

  private removeSessionWidgets(sessionId: string): void {
    this.syncDoc
      .getHandler(LayoutHandler)
      .getWidgetIdsForSession(sessionId)
      .forEach((childId) => this.removeWidget(childId));
  }

  /** A content session dropped by a property change (e.g. a removed tab) takes its widgets with it. */
  private removeDroppedSessionWidgets(previous: Widget, next: Widget): void {
    const kept = new Set(getContentSessions(next).map(({ id }) => id));
    getContentSessions(previous)
      .filter(({ id }) => !kept.has(id))
      .forEach(({ id }) => this.removeSessionWidgets(id));
  }

  setProperty<K extends keyof WidgetProperties>(widgetId: string, key: K, value: WidgetProperties[K]): void {
    const current = this.widgets.get(widgetId);
    if (!current) return;
    const widget = { ...current, [key]: value };
    this.widgets.set(widgetId, widget);
    this.syncDoc.emit(new WidgetPropertyChangedEvent(widget, key));
    this.removeDroppedSessionWidgets(current, widget);
  }

  setProperties(widgetId: string, properties: Partial<WidgetProperties>): void {
    const current = this.widgets.get(widgetId);
    if (!current) return;
    const widget = { ...current, ...properties };
    this.widgets.set(widgetId, widget);
    for (const key of Object.keys(properties) as (keyof WidgetProperties)[]) {
      this.syncDoc.emit(new WidgetPropertyChangedEvent(widget, key));
    }
    this.removeDroppedSessionWidgets(current, widget);
  }
}
