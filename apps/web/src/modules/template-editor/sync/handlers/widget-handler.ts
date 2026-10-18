import type { WidgetType } from "@tomato/constants";
import type { Widget, WidgetProperties } from "@tomato/types";
import { SyncHandler, type SyncDoc } from "@/shared/lib/sync";
import { WidgetItems } from "../../constants/widget-items.constants";
import { TemplateDocKey } from "@tomato/constants";
import { WidgetAddedEvent, WidgetPropertyChangedEvent, WidgetRemovedEvent } from "../sync.events";

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
    this.widgets.set(id, widget);
    this.syncDoc.emit(new WidgetAddedEvent(widget, before));
  }

  removeWidget(widgetId: string): void {
    if (!this.widgets.has(widgetId)) return;
    this.widgets.delete(widgetId);
    this.syncDoc.emit(new WidgetRemovedEvent(widgetId));
  }

  setProperty<K extends keyof WidgetProperties>(widgetId: string, key: K, value: WidgetProperties[K]): void {
    const current = this.widgets.get(widgetId);
    if (!current) return;
    const widget = { ...current, [key]: value };
    this.widgets.set(widgetId, widget);
    this.syncDoc.emit(new WidgetPropertyChangedEvent(widget, key));
  }

  setProperties(widgetId: string, properties: Partial<WidgetProperties>): void {
    const current = this.widgets.get(widgetId);
    if (!current) return;
    const widget = { ...current, ...properties };
    this.widgets.set(widgetId, widget);
    for (const key of Object.keys(properties) as (keyof WidgetProperties)[]) {
      this.syncDoc.emit(new WidgetPropertyChangedEvent(widget, key));
    }
  }
}
