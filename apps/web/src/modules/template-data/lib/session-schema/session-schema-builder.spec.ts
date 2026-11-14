import { WidgetType } from "@tomato/constants";
import type { Session, Widget } from "@/shared/types/template.types";
import { describe, expect, it } from "vitest";
import { SessionSchemaBuilder } from "./session-schema-builder";

function widget(id: string, type: WidgetType, properties: Partial<Widget> = {}): Widget {
  return { id, type, label: id, ...properties };
}

function data(widgets: Widget[], widgetToSession: Record<string, string>) {
  return { widgets: Object.fromEntries(widgets.map((item) => [item.id, item])), widgetToSession };
}

const canvasSession: Session = { id: "canvas-s", name: "Canvas", nested: { type: "widget", uuid: "canvas" } };
const tab: Session = { id: "tab", name: "Tab", nested: { type: "widget", uuid: "mixed" } };
const form = data(
  [
    widget("name", WidgetType.TEXT, { required: true }),
    widget("note", WidgetType.TEXT),
    widget("next", WidgetType.BUTTON),
    widget("city", WidgetType.TEXT, { required: true }),
    widget("canvas", WidgetType.CANVAS, { session: canvasSession }),
    widget("pin", WidgetType.TEXT, { required: true }),
    widget("mixed", WidgetType.MIXED_VIEW, { tabs: [tab] }),
    widget("sign", WidgetType.SIGNATURE, { required: true }),
  ],
  { name: "s1", note: "s1", next: "s1", city: "s2", canvas: "s1", pin: "canvas-s", mixed: "s1", sign: "tab" },
);

describe("SessionSchemaBuilder", () => {
  const builder = new SessionSchemaBuilder(form);

  it("builds a key for every value widget of the session, nested ones under their scoped key", () => {
    expect(Object.keys(builder.build("s1").shape).sort()).toEqual(["mixed.tab.sign", "name", "note", "pin"]);
    expect(Object.keys(builder.build("s2").shape)).toEqual(["city"]);
  });

  it("requires a value for the required widgets only", () => {
    const schema = builder.build("s1");

    expect(schema.safeParse({ name: "Ada", pin: "1" }).success).toBe(false);
    expect(schema.safeParse({ name: "", pin: "1", "mixed.tab.sign": "data:" }).success).toBe(false);
    expect(schema.safeParse({ name: "Ada", pin: "1", "mixed.tab.sign": "data:" }).success).toBe(true);
  });
});
