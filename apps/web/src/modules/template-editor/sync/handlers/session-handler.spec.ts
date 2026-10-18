import { WidgetType } from "@tomato/constants";
import { describe, expect, it, vi } from "vitest";
import { SyncDoc } from "@/shared/lib/sync";
import { SessionRemovedEvent } from "../sync.events";
import { LayoutHandler } from "./layout-handler";
import { SessionHandler } from "./session-handler";
import { WidgetHandler } from "./widget-handler";

function createHandlers() {
  const syncDoc = new SyncDoc();
  const sessionHandler = syncDoc.registerHandler(new SessionHandler(syncDoc));
  const widgetHandler = syncDoc.registerHandler(new WidgetHandler(syncDoc));
  const layoutHandler = syncDoc.registerHandler(new LayoutHandler(syncDoc));
  return { syncDoc, sessionHandler, widgetHandler, layoutHandler };
}

describe("SessionHandler.removeSession", () => {
  it("removes the session from the sessions map", () => {
    const { sessionHandler } = createHandlers();
    sessionHandler.addSession("s1", { name: "Section 1" });
    sessionHandler.addSession("s2", { name: "Section 2" });

    sessionHandler.removeSession("s2");

    expect(sessionHandler.getSession("s2")).toBeUndefined();
    expect(sessionHandler.getSession("s1")).toBeDefined();
  });

  it("cascade-deletes widgets of the removed session with their layout", () => {
    const { sessionHandler, widgetHandler, layoutHandler } = createHandlers();
    sessionHandler.addSession("s1", { name: "Section 1" });
    sessionHandler.addSession("s2", { name: "Section 2" });
    widgetHandler.addWidget("w1", WidgetType.TEXT, null);
    layoutHandler.setLayout("w1", "s2", {});

    sessionHandler.removeSession("s2");

    expect(widgetHandler.getWidget("w1")).toBeUndefined();
    expect(layoutHandler.getLayout("w1")).toBeUndefined();
  });

  it("leaves widgets belonging to other sessions untouched", () => {
    const { sessionHandler, widgetHandler, layoutHandler } = createHandlers();
    sessionHandler.addSession("s1", { name: "Section 1" });
    sessionHandler.addSession("s2", { name: "Section 2" });
    widgetHandler.addWidget("w1", WidgetType.TEXT, null);
    layoutHandler.setLayout("w1", "s1", {});

    sessionHandler.removeSession("s2");

    expect(widgetHandler.getWidget("w1")).toBeDefined();
    expect(layoutHandler.getLayout("w1")).toBeDefined();
  });

  it("refuses to remove the last remaining session", () => {
    const { sessionHandler } = createHandlers();
    sessionHandler.addSession("s1", { name: "Only session" });

    sessionHandler.removeSession("s1");

    expect(sessionHandler.getSession("s1")).toBeDefined();
  });

  it("emits a SessionRemovedEvent for the removed session", () => {
    const { syncDoc, sessionHandler } = createHandlers();
    sessionHandler.addSession("s1", { name: "Section 1" });
    sessionHandler.addSession("s2", { name: "Section 2" });
    const listener = vi.fn();
    syncDoc.on(SessionRemovedEvent, listener);

    sessionHandler.removeSession("s2");

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ sessionId: "s2" }));
  });

  it("does nothing when the session does not exist", () => {
    const { syncDoc, sessionHandler } = createHandlers();
    sessionHandler.addSession("s1", { name: "Section 1" });
    const listener = vi.fn();
    syncDoc.on(SessionRemovedEvent, listener);

    sessionHandler.removeSession("missing");

    expect(listener).not.toHaveBeenCalled();
  });
});

describe("SessionHandler.updateSession", () => {
  it("merges the patch into the session", () => {
    const { sessionHandler } = createHandlers();
    sessionHandler.addSession("s1", { name: "Section 1" });

    sessionHandler.updateSession("s1", { name: "Renamed" });

    expect(sessionHandler.getSession("s1")).toEqual({ id: "s1", name: "Renamed" });
  });
});
