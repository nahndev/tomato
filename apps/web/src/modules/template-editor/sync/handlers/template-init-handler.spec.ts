import { TemplateDocKey, WidgetType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { createSyncDoc } from "../create-sync-doc";
import { TemplateHandler } from "./template-handler";

function widgetTypes(doc: Y.Doc): string[] {
  return [...doc.getMap<{ type: string }>(TemplateDocKey.WIDGETS).values()].map((widget) => widget.type).sort();
}

describe("TemplateInitHandler", () => {
  it("seeds the system widgets once the doc has synced", () => {
    const syncDoc = createSyncDoc();

    syncDoc.synced();

    expect(widgetTypes(syncDoc.doc)).toEqual([WidgetType.CREATED_AT, WidgetType.SUBMITTED_BY, WidgetType.TEMPLATE].sort());
    expect(syncDoc.getHandler(TemplateHandler).isReady()).toBe(true);
  });

  it("does not seed again on a second sync", () => {
    const syncDoc = createSyncDoc();

    syncDoc.synced();
    const before = Y.encodeStateAsUpdate(syncDoc.doc);
    syncDoc.synced();

    expect(Y.encodeStateAsUpdate(syncDoc.doc)).toEqual(before);
  });

  it("does not duplicate the system widgets when two clients seed a fresh doc", () => {
    const first = createSyncDoc();
    const second = createSyncDoc();
    first.synced();
    second.synced();

    Y.applyUpdate(first.doc, Y.encodeStateAsUpdate(second.doc));

    expect(widgetTypes(first.doc)).toHaveLength(3);
  });
});
