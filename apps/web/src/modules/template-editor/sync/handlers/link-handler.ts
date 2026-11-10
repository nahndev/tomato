import { LinkDeleteAction, LinkTargetType, TemplateDocKey } from "@tomato/constants";
import type { LinkTarget, WidgetLink } from "@tomato/types";
import { OnSyncEvent, SyncHandler, type SyncDoc } from "@/shared/lib/sync";
import { WidgetRemovedEvent } from "../sync.events";
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

  setLink(widgetId: string, type: LinkTargetType, target: LinkTarget | undefined): void {
    const next: WidgetLink = { ...this.links.get(widgetId), [type]: target };
    if (!target) delete next[type];
    if (Object.keys(next).length > 0) this.links.set(widgetId, next);
    else this.links.delete(widgetId);
  }

  setWidgetLink(widgetId: string, linkWidgetUuid: string | undefined): void {
    const target = linkWidgetUuid ? { uuid: linkWidgetUuid, onDelete: LinkDeleteAction.CASCADE } : undefined;
    this.setLink(widgetId, LinkTargetType.WIDGET, target);
  }

  @OnSyncEvent(WidgetRemovedEvent)
  onWidgetRemoved({ widgetId }: WidgetRemovedEvent): void {
    this.links.delete(widgetId);

    const widgetHandler = this.syncDoc.getHandler(WidgetHandler);
    Array.from(this.links.entries())
      .forEach(([linkingId, link]) => {
        const target = link[LinkTargetType.WIDGET];
        if (target?.uuid !== widgetId) return;
        if (target.onDelete === LinkDeleteAction.CASCADE) widgetHandler.removeWidget(linkingId);
        else this.setLink(linkingId, LinkTargetType.WIDGET, undefined);
      });
  }
}
