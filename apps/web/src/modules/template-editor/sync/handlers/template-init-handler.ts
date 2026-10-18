import { TemplateDocKey, WidgetType } from "@tomato/constants";
import type { Widget } from "@tomato/types";
import { SyncHandler, type OnSynced, type SyncDoc } from "@/shared/lib/sync";
import { WidgetItems } from "../../constants/widget-items.constants";
import { SYSTEM_WIDGET_ID_PREFIX } from "../../template-editor.constants";
import { TemplateHandler } from "./template-handler";

const DEFAULT_SYSTEM_WIDGET_TYPES: WidgetType[] = [
  WidgetType.CREATED_AT,
  WidgetType.TEMPLATE,
  WidgetType.SUBMITTED_BY,
];

/**
 * Seeds the system widgets straight into the `widgets` map (no layout, so it
 * bypasses `WidgetHandler.addWidget`). Ids are deterministic so two clients
 * seeding a fresh doc at once write the same keys instead of duplicating them.
 */
@SyncHandler()
export class TemplateInitHandler implements OnSynced {
  constructor(private readonly syncDoc: SyncDoc) {}

  onSynced(): void {
    const templateHandler = this.syncDoc.getHandler(TemplateHandler);
    if (templateHandler.isReady()) return;

    const widgets = this.syncDoc.doc.getMap<Widget>(TemplateDocKey.WIDGETS);

    this.syncDoc.doc.transact(() => {
      for (const type of DEFAULT_SYSTEM_WIDGET_TYPES) {
        const id = `${SYSTEM_WIDGET_ID_PREFIX}${type}`;
        widgets.set(id, { id, type, ...WidgetItems[type].defaultSettings });
      }
      templateHandler.markReady();
    });
  }
}
