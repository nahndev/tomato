import { SyncDoc } from "@/shared/lib/sync";
import { LayoutHandler } from "./handlers/layout-handler";
import { SessionHandler } from "./handlers/session-handler";
import { TemplateHandler } from "./handlers/template-handler";
import { TemplateInitHandler } from "./handlers/template-init-handler";
import { WidgetHandler } from "./handlers/widget-handler";

export function createSyncDoc(): SyncDoc {
  const syncDoc = new SyncDoc();
  syncDoc.registerHandler(new SessionHandler(syncDoc));
  syncDoc.registerHandler(new WidgetHandler(syncDoc));
  syncDoc.registerHandler(new LayoutHandler(syncDoc));
  syncDoc.registerHandler(new TemplateHandler(syncDoc));
  syncDoc.registerHandler(new TemplateInitHandler(syncDoc));
  return syncDoc;
}
