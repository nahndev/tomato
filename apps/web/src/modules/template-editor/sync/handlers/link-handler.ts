import { OnSyncEvent, SyncHandler, type SyncDoc } from "@/shared/lib/sync";
import type { LinkTarget, WidgetLink } from "@/shared/types/template.types";
import {
  LinkDeleteAction,
  LinkTargetType,
  TemplateDocKey,
  WidgetType,
} from "@tomato/constants";
import { WidgetPropertyChangedEvent, WidgetRemovedEvent } from "../sync.events";
import { WidgetHandler } from "./widget-handler";

@SyncHandler()
export class LinkHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get links() {
    return this.syncDoc.doc.getMap<WidgetLink>(TemplateDocKey.LINKS);
  }

  getLink(widgetId: string): WidgetLink | undefined {
    return this.links.get(widgetId);
  }

  setLink(widgetId: string, type: LinkTargetType, target: LinkTarget): void {
    this.links.set(widgetId, {
      ...this.links.get(widgetId),
      [type]: target,
    });
  }

  removeLink(widgetId: string, type: LinkTargetType): void {
    const next: WidgetLink = { ...this.links.get(widgetId) };
    delete next[type];
    if (Object.keys(next).length > 0) this.links.set(widgetId, next);
    else this.links.delete(widgetId);
  }

  @OnSyncEvent(WidgetPropertyChangedEvent)
  onWidgetPropertyChanged({ widget }: WidgetPropertyChangedEvent): void {
    if (widget.type !== WidgetType.REPEAT_VIEW && widget.type !== WidgetType.REFER_SUBMISSION) return;
    if (widget.linkWidgetUuid) {
      this.setLink(widget.id, LinkTargetType.WIDGET, {
        uuid: widget.linkWidgetUuid,
        onDelete: LinkDeleteAction.CASCADE,
      });
    }
    if (widget.type === WidgetType.REFER_SUBMISSION && widget.linkTemplateUuid) {
      this.setLink(widget.id, LinkTargetType.TEMPLATE, {
        uuid: widget.linkTemplateUuid,
        onDelete: LinkDeleteAction.NONE,
      });
    }
  }

  @OnSyncEvent(WidgetRemovedEvent)
  onWidgetRemoved({ widgetId }: WidgetRemovedEvent): void {
    this.links.delete(widgetId);

    const widgetHandler = this.syncDoc.getHandler(WidgetHandler);
    Array.from(this.links.entries()).forEach(([linkingId, link]) => {
      const target = link[LinkTargetType.WIDGET];
      if (target?.uuid !== widgetId) return;
      if (target.onDelete === LinkDeleteAction.CASCADE) {
        widgetHandler.removeWidget(linkingId);
      }
    });
  }
}
