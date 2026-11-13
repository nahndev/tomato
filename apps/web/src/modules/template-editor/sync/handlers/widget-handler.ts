import { TemplateDocKey, WidgetType } from "@tomato/constants";
import type { Widget, WidgetProperties } from "@/shared/types/template.types";
import { OnSyncEvent, SyncHandler, type SyncDoc } from "@/shared/lib/sync";
import { WidgetItems } from "@/modules/template-widget";
import { CONTENT_SESSION_KEYS, DEFAULT_TAB_NAMES } from "../../template-editor.constants";
import {
  WidgetAddedEvent,
  WidgetPropertyChangedEvent,
  WidgetRemovedEvent,
} from "../sync.events";
import { LayoutHandler } from "./layout-handler";
import {
  canNestWidget,
  createContentSession,
  findContainerWidgetId,
  getContentSessions,
  isContainerWidget,
} from "../../utils/container";

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
    if (type === WidgetType.CANVAS || type === WidgetType.REPEAT_VIEW) {
      widget.session = createContentSession(id, widget.label);
    }
    if (type === WidgetType.MIXED_VIEW) widget.tabs = DEFAULT_TAB_NAMES.map((name) => createContentSession(id, name));
    this.widgets.set(id, widget);
    const anchor = before && !canNestWidget(type) ? this.getTopLevelWidget(before) : before;
    this.syncDoc.emit(new WidgetAddedEvent(widget, anchor));
  }

  canPlace(widgetId: string, sessionId: string): boolean {
    return canNestWidget(this.widgets.get(widgetId)?.type) || !this.findContainer(sessionId);
  }

  removeWidget(widgetId: string): void {
    const widget = this.widgets.get(widgetId);
    if (!widget) return;
    this.widgets.delete(widgetId);
    this.syncDoc.emit(new WidgetRemovedEvent(widgetId, widget));
  }

  setProperty<K extends keyof WidgetProperties>(widgetId: string, key: K, value: WidgetProperties[K]): void {
    const current = this.widgets.get(widgetId);
    if (!current) return;
    const widget = { ...current, [key]: value };
    this.widgets.set(widgetId, widget);
    this.syncDoc.emit(new WidgetPropertyChangedEvent(widget, key, current));
  }

  setProperties(widgetId: string, properties: Partial<WidgetProperties>): void {
    const current = this.widgets.get(widgetId);
    if (!current) return;
    const widget = { ...current, ...properties };
    this.widgets.set(widgetId, widget);
    for (const key of Object.keys(properties) as (keyof WidgetProperties)[]) {
      this.syncDoc.emit(new WidgetPropertyChangedEvent(widget, key, current));
    }
  }

  /** The widget, or the outermost container holding it. */
  private getTopLevelWidget(widget: Widget): Widget {
    const sessionId = this.syncDoc.getHandler(LayoutHandler).getSessionId(widget.id);
    const container = sessionId ? this.findContainer(sessionId) : undefined;
    return container ? this.getTopLevelWidget(container) : widget;
  }

  private findContainer(sessionId: string): Widget | undefined {
    const containerId = findContainerWidgetId(Object.fromEntries(this.widgets.entries()), sessionId);
    return containerId ? this.widgets.get(containerId) : undefined;
  }

  @OnSyncEvent(WidgetRemovedEvent)
  onWidgetRemoved({ widget }: WidgetRemovedEvent): void {
    if (!isContainerWidget(widget.type)) return;
    const layoutHandler = this.syncDoc.getHandler(LayoutHandler);
    getContentSessions(widget)
      .flatMap(({ id }) => layoutHandler.getWidgetIdsForSession(id))
      .forEach((childId) => this.removeWidget(childId));
  }

  @OnSyncEvent(WidgetPropertyChangedEvent)
  onWidgetPropertyChanged({ widget, key, previous }: WidgetPropertyChangedEvent): void {
    if (!CONTENT_SESSION_KEYS.includes(key)) return;
    const kept = new Set(getContentSessions(widget).map(({ id }) => id));
    const layoutHandler = this.syncDoc.getHandler(LayoutHandler);
    getContentSessions(previous)
      .filter(({ id }) => !kept.has(id))
      .flatMap(({ id }) => layoutHandler.getWidgetIdsForSession(id))
      .forEach((childId) => this.removeWidget(childId));
  }
}
