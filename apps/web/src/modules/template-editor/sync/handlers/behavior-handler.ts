import { TemplateDocKey, type WidgetBehaviorType } from "@tomato/constants";
import { OnSyncEvent, SyncHandler, type SyncDoc } from "@/shared/lib/sync";
import { WIDGET_BEHAVIORS } from "../../template-editor.constants";
import { WidgetAddedEvent, WidgetRemovedEvent } from "../sync.events";

@SyncHandler()
export class BehaviorHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get behaviors() {
    return this.syncDoc.doc.getMap<WidgetBehaviorType[]>(TemplateDocKey.BEHAVIORS);
  }

  getBehaviors(widgetId: string): WidgetBehaviorType[] | undefined {
    return this.behaviors.get(widgetId);
  }

  @OnSyncEvent(WidgetAddedEvent)
  onWidgetAdded({ widget }: WidgetAddedEvent): void {
    const behaviors = WIDGET_BEHAVIORS[widget.type];
    if (behaviors) this.behaviors.set(widget.id, [...behaviors]);
  }

  @OnSyncEvent(WidgetRemovedEvent)
  onWidgetRemoved({ widgetId }: WidgetRemovedEvent): void {
    this.behaviors.delete(widgetId);
  }
}
