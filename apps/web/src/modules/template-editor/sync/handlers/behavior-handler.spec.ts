import { WidgetBehaviorType, WidgetType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import { SyncDoc } from "@/shared/lib/sync";
import { BehaviorHandler } from "./behavior-handler";
import { LayoutHandler } from "./layout-handler";
import { SessionHandler } from "./session-handler";
import { WidgetHandler } from "./widget-handler";

function createHandlers() {
  const syncDoc = new SyncDoc();
  syncDoc.registerHandler(new SessionHandler(syncDoc));
  const widgetHandler = syncDoc.registerHandler(new WidgetHandler(syncDoc));
  syncDoc.registerHandler(new LayoutHandler(syncDoc));
  const behaviorHandler = syncDoc.registerHandler(new BehaviorHandler(syncDoc));
  return { widgetHandler, behaviorHandler };
}

describe("BehaviorHandler", () => {
  it("records the behaviors of a widget type when the widget is added", () => {
    const { widgetHandler, behaviorHandler } = createHandlers();

    widgetHandler.addWidget("refer", WidgetType.REFER_SUBMISSION, null);

    expect(behaviorHandler.getBehaviors("refer")).toEqual([WidgetBehaviorType.REFER_SUBMISSION]);
  });

  it("records nothing for a widget type without behaviors", () => {
    const { widgetHandler, behaviorHandler } = createHandlers();

    widgetHandler.addWidget("name", WidgetType.TEXT, null);

    expect(behaviorHandler.getBehaviors("name")).toBeUndefined();
  });

  it("drops the behaviors when the widget is removed", () => {
    const { widgetHandler, behaviorHandler } = createHandlers();
    widgetHandler.addWidget("refer", WidgetType.REFER_SUBMISSION, null);

    widgetHandler.removeWidget("refer");

    expect(behaviorHandler.getBehaviors("refer")).toBeUndefined();
  });
});
