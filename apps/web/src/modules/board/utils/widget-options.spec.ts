import { DisplayType, ValueType, WidgetType } from "@tomato/constants";
import type { TemplateSnapshot, Widget } from "@tomato/types";
import { describe, expect, it } from "vitest";
import { formatOptionKey, groupWidgetOptions, parseOptionKey, UNGROUPED_SESSION } from "./widget-options";
import { getCommonDisplayTypes } from "./widget-value-types";

function widget(id: string, type: WidgetType): Widget {
  return { id, type, label: id };
}

const SNAPSHOT: TemplateSnapshot = {
  name: "Intake",
  widgets: {
    name: widget("name", WidgetType.TEXT),
    at: widget("at", WidgetType.DATETIME),
    intro: widget("intro", WidgetType.LABEL),
    loose: widget("loose", WidgetType.NUMBER),
  },
  layouts: {},
  widgetToSession: { name: "s1", at: "s1", intro: "s1" },
  sessions: { s1: { id: "s1", name: "Section 1" } },
};

describe("groupWidgetOptions", () => {
  it("lists displayable widgets by session, one option per value property", () => {
    const groups = groupWidgetOptions(SNAPSHOT, null);

    expect(groups.map((group) => group.sessionId)).toEqual(["s1", UNGROUPED_SESSION]);
    expect(groups[0].options.map((option) => option.key)).toEqual(["name:default", "at:default", "at:date", "at:time"]);
    expect(groups[1].sessionName).toBeNull();
  });

  it("keeps only the properties that fit the allowed display types", () => {
    const groups = groupWidgetOptions(SNAPSHOT, [DisplayType.TIME]);

    expect(groups.flatMap((group) => group.options.map((option) => option.key))).toEqual(["at:default", "at:time"]);
  });

  it("returns nothing when no widget fits", () => {
    expect(groupWidgetOptions(SNAPSHOT, [])).toEqual([]);
  });
});

describe("option key", () => {
  it("round-trips", () => {
    expect(parseOptionKey(formatOptionKey("w1", ValueType.DATE))).toEqual({ widgetId: "w1", property: ValueType.DATE });
  });
});

describe("getCommonDisplayTypes", () => {
  it("is unrestricted without entries", () => {
    expect(getCommonDisplayTypes([])).toBeNull();
  });

  it("intersects the display types of the entries", () => {
    expect(
      getCommonDisplayTypes([
        { widgetType: WidgetType.DATETIME, property: ValueType.DEFAULT },
        { widgetType: WidgetType.DATE, property: ValueType.DEFAULT },
      ]),
    ).toEqual([DisplayType.TEXT, DisplayType.DATE]);
  });

  it("narrows to what every entry can render as", () => {
    expect(
      getCommonDisplayTypes([
        { widgetType: WidgetType.NUMBER, property: ValueType.DEFAULT },
        { widgetType: WidgetType.TIME, property: ValueType.DEFAULT },
      ]),
    ).toEqual([DisplayType.TEXT]);
  });
});
