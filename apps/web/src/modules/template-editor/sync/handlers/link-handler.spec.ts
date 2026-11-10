import { LinkDeleteAction, LinkTargetType, WidgetType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import { SyncDoc } from "@/shared/lib/sync";
import { LayoutHandler } from "./layout-handler";
import { LinkHandler } from "./link-handler";
import { SessionHandler } from "./session-handler";
import { WidgetHandler } from "./widget-handler";

function createHandlers() {
  const syncDoc = new SyncDoc();
  syncDoc.registerHandler(new SessionHandler(syncDoc));
  const widgetHandler = syncDoc.registerHandler(new WidgetHandler(syncDoc));
  syncDoc.registerHandler(new LayoutHandler(syncDoc));
  const linkHandler = syncDoc.registerHandler(new LinkHandler(syncDoc));
  widgetHandler.addWidget("room", WidgetType.SELECT, null);
  widgetHandler.addWidget("rv", WidgetType.REPEAT_VIEW, null);
  return { widgetHandler, linkHandler };
}

describe("LinkHandler", () => {
  it("stores a widget link keyed by the linking widget, cascading on delete", () => {
    const { linkHandler } = createHandlers();

    linkHandler.setWidgetLink("rv", "room");

    expect(linkHandler.getLink("rv")).toEqual({
      [LinkTargetType.WIDGET]: { uuid: "room", onDelete: LinkDeleteAction.CASCADE },
    });
  });

  it("removes only the link when unlinking", () => {
    const { linkHandler } = createHandlers();
    linkHandler.setWidgetLink("rv", "room");

    linkHandler.setWidgetLink("rv", undefined);

    expect(linkHandler.getLink("rv")).toBeUndefined();
  });

  it("removes the linking widget when the linked widget is removed", () => {
    const { widgetHandler, linkHandler } = createHandlers();
    linkHandler.setWidgetLink("rv", "room");

    widgetHandler.removeWidget("room");

    expect(widgetHandler.getWidget("rv")).toBeUndefined();
    expect(linkHandler.getLink("rv")).toBeUndefined();
  });

  it("drops the link, not the linked widget, when the linking widget is removed", () => {
    const { widgetHandler, linkHandler } = createHandlers();
    linkHandler.setWidgetLink("rv", "room");

    widgetHandler.removeWidget("rv");

    expect(linkHandler.getLink("rv")).toBeUndefined();
    expect(widgetHandler.getWidget("room")).toBeDefined();
  });

  it("keeps a widget's other link types when one is set or removed", () => {
    const { linkHandler } = createHandlers();
    const other = { uuid: "x", onDelete: LinkDeleteAction.CASCADE };
    linkHandler.setLink("rv", "other" as LinkTargetType, other);

    linkHandler.setWidgetLink("rv", "room");
    expect(linkHandler.getLink("rv")).toEqual({
      other,
      [LinkTargetType.WIDGET]: { uuid: "room", onDelete: LinkDeleteAction.CASCADE },
    });

    linkHandler.setWidgetLink("rv", undefined);
    expect(linkHandler.getLink("rv")).toEqual({ other });
  });
});
