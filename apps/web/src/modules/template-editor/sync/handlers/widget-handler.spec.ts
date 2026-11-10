import { SessionNestedType, WidgetType } from "@tomato/constants";
import { describe, expect, it, vi } from "vitest";
import { SyncDoc } from "@/shared/lib/sync";
import { WidgetRemovedEvent } from "../sync.events";
import { LayoutHandler } from "./layout-handler";
import { SessionHandler } from "./session-handler";
import { WidgetHandler } from "./widget-handler";

function createHandlers() {
  const syncDoc = new SyncDoc();
  syncDoc.registerHandler(new SessionHandler(syncDoc));
  const layoutHandler = syncDoc.registerHandler(new LayoutHandler(syncDoc));
  const widgetHandler = syncDoc.registerHandler(new WidgetHandler(syncDoc));
  return { syncDoc, widgetHandler, layoutHandler };
}

describe("WidgetHandler.addWidget", () => {
  it("gives a repeat view its content session, like a canvas", () => {
    const { widgetHandler } = createHandlers();

    widgetHandler.addWidget("rv", WidgetType.REPEAT_VIEW, null);

    expect(widgetHandler.getWidget("rv")?.session?.nested).toEqual({ type: SessionNestedType.WIDGET, uuid: "rv" });
  });
});

describe("WidgetHandler.setProperty", () => {
  function createMixedView() {
    const handlers = createHandlers();
    const { widgetHandler, layoutHandler } = handlers;
    widgetHandler.addWidget("mv", WidgetType.MIXED_VIEW, null);
    const [kept, dropped] = widgetHandler.getWidget("mv")?.tabs ?? [];
    widgetHandler.addWidget("inKept", WidgetType.TEXT, null);
    widgetHandler.addWidget("inDropped", WidgetType.TEXT, null);
    layoutHandler.setLayout("inKept", kept.id, {});
    layoutHandler.setLayout("inDropped", dropped.id, {});
    return { ...handlers, kept };
  }

  it("removes the widgets of a tab dropped from `tabs`", () => {
    const { widgetHandler, kept } = createMixedView();

    widgetHandler.setProperty("mv", "tabs", [kept]);

    expect(widgetHandler.getWidget("inDropped")).toBeUndefined();
    expect(widgetHandler.getWidget("inKept")).toBeDefined();
  });

  it("keeps every widget when a property not holding sessions changes", () => {
    const { widgetHandler } = createMixedView();

    widgetHandler.setProperties("mv", { label: "Household" });

    expect(widgetHandler.getWidget("inDropped")).toBeDefined();
    expect(widgetHandler.getWidget("inKept")).toBeDefined();
  });
});

describe("WidgetHandler.removeWidget", () => {
  it("removes the widgets in every content session of a removed container, nested ones included", () => {
    const { widgetHandler, layoutHandler } = createHandlers();
    widgetHandler.addWidget("mv", WidgetType.MIXED_VIEW, null);
    const [first, second] = widgetHandler.getWidget("mv")?.tabs ?? [];
    widgetHandler.addWidget("text", WidgetType.TEXT, null);
    widgetHandler.addWidget("canvas", WidgetType.CANVAS, null);
    widgetHandler.addWidget("deep", WidgetType.TEXT, null);
    layoutHandler.setLayout("text", first.id, {});
    layoutHandler.setLayout("canvas", second.id, {});
    layoutHandler.setLayout("deep", widgetHandler.getWidget("canvas")?.session?.id ?? "", {});

    widgetHandler.removeWidget("mv");

    expect(widgetHandler.getWidget("text")).toBeUndefined();
    expect(widgetHandler.getWidget("canvas")).toBeUndefined();
    expect(widgetHandler.getWidget("deep")).toBeUndefined();
  });

  it("emits WidgetRemovedEvent with the removed widget", () => {
    const { syncDoc, widgetHandler } = createHandlers();
    widgetHandler.addWidget("t", WidgetType.TEXT, null);
    const widget = widgetHandler.getWidget("t");
    const listener = vi.fn();
    syncDoc.on(WidgetRemovedEvent, listener);

    widgetHandler.removeWidget("t");

    expect(listener.mock.calls[0][0]).toMatchObject({ widgetId: "t", widget });
  });
});
