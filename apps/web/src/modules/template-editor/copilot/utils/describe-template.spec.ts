import { SessionNestedType, WidgetType } from "@tomato/constants";
import type { GridLayout, Session, Widget } from "@/shared/types/template.types";
import { describe, expect, it } from "vitest";
import { describeSelection, describeSessions } from "./describe-template";

function getMockWidget(overrides: Partial<Widget> = {}): Widget {
  return { id: "w1", type: WidgetType.TEXT, label: "Name", ...overrides };
}

function getMockState(selectedId: string | null) {
  const widgets: Record<string, Widget> = {
    w1: getMockWidget({ id: "w1", label: "First name" }),
    w2: getMockWidget({ id: "w2", label: "Last name", required: true }),
    w3: getMockWidget({ id: "w3", label: "Email" }),
  };
  const sessions: Record<string, Session> = {
    s1: { id: "s1", name: "Contact" },
    s2: { id: "s2", name: "Other" },
  };
  const layouts: Record<string, GridLayout> = {
    w1: { column: 0, span: 4, idx: "a" },
    w2: { column: 4, span: 4, idx: "b" },
    w3: { column: 0, span: 4, idx: "a" },
  };
  const widgetToSession = { w1: "s1", w2: "s1", w3: "s2" };
  return { selected: selectedId ? widgets[selectedId] : null, widgets, sessions, layouts, widgetToSession };
}

describe("describeSelection", () => {
  it("describes the selected widget with its properties, layout and place in its session", () => {
    const selection = describeSelection(getMockState("w2"));

    expect(selection.widget).toMatchObject({
      widgetId: "w2",
      type: WidgetType.TEXT,
      label: "Last name",
      properties: { required: true },
      layout: { column: 4, span: 4 },
      session: { id: "s1", name: "Contact" },
      position: { index: 2, of: 2 },
      previousWidgetId: "w1",
      nextWidgetId: null,
    });
    expect(selection.widget?.settableProperties).toEqual(expect.any(Array));
  });

  it("sets the neighbours of a first widget", () => {
    const { widget } = describeSelection(getMockState("w1"));

    expect(widget).toMatchObject({ previousWidgetId: null, nextWidgetId: "w2" });
  });

  it("takes the current session from the selected widget", () => {
    expect(describeSelection(getMockState("w3")).currentSession).toEqual({
      id: "s2",
      name: "Other",
      derivedFrom: "selected-widget",
    });
  });

  it("falls back to the first session when no widget is selected", () => {
    expect(describeSelection(getMockState(null))).toEqual({
      widget: null,
      currentSession: { id: "s1", name: "Contact", derivedFrom: "first-session" },
    });
  });

  it("has no current session in a template without sessions", () => {
    const state = { ...getMockState(null), sessions: {} };

    expect(describeSelection(state).currentSession).toBeNull();
  });
});

describe("describeSessions", () => {
  it("lists a session's widgets in placement order", () => {
    const [first] = describeSessions(getMockState(null));

    expect(first.widgets.map((widget) => widget.widgetId)).toEqual(["w1", "w2"]);
  });
});

describe("canvas content", () => {
  function getCanvasState(selectedId: string | null) {
    const state = getMockState(null);
    const widgets: Record<string, Widget> = {
      ...state.widgets,
      canvas: getMockWidget({
        id: "canvas",
        type: WidgetType.CANVAS,
        label: "Address",
        session: { id: "content", name: "Address", nested: { type: SessionNestedType.WIDGET, uuid: "canvas" } },
      }),
      street: getMockWidget({ id: "street", label: "Street" }),
    };
    return {
      ...state,
      selected: selectedId ? widgets[selectedId] : null,
      widgets,
      layouts: {
        ...state.layouts,
        canvas: { column: 0, span: 4, idx: "c", isFullWidth: true },
        street: { column: 0, span: 4, idx: "a" },
      },
      widgetToSession: { ...state.widgetToSession, canvas: "s1", street: "content" },
    };
  }

  it("lists a canvas's widgets under it, not as a session", () => {
    const sessions = describeSessions(getCanvasState(null));

    expect(sessions.map((session) => session.id)).toEqual(["s1", "s2"]);
    expect(sessions[0]?.widgets.at(-1)).toMatchObject({
      widgetId: "canvas",
      content: { sessionId: "content", widgets: [{ widgetId: "street" }] },
    });
  });

  it("describes a widget inside a canvas with the canvas and its top session", () => {
    const selection = describeSelection(getCanvasState("street"));

    expect(selection.widget).toMatchObject({ canvasId: "canvas", position: { index: 1, of: 1 } });
    expect(selection.currentSession).toMatchObject({ id: "s1" });
  });
});
