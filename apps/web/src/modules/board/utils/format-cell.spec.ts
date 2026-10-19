import { DisplayType, ValueType } from "@tomato/constants";
import type { BoardColumn, Submission } from "@tomato/types";
import { describe, expect, it } from "vitest";
import { EMPTY_CELL } from "../board.constants";
import { formatCell } from "./format-cell";

const TEMPLATE_ID = "template-a";
const TIMESTAMP = Date.UTC(2026, 9, 19, 8, 30);

function column(type: DisplayType, widgetId = "w1"): BoardColumn {
  return {
    id: "c1",
    type,
    size: { flex: 1 },
    label: "Col",
    items: { [TEMPLATE_ID]: { widgetId, property: ValueType.DEFAULT } },
  };
}

function submission(dataDisplays: Submission["dataDisplays"], templateId = TEMPLATE_ID): Submission {
  return { id: "s1", boardId: "b1", templateId, templateVersionId: "v1", data: {}, dataDisplays, createdAt: "", updatedAt: "" };
}

describe("formatCell", () => {
  it("shows the text bucket", () => {
    expect(formatCell(column(DisplayType.TEXT), submission({ w1: { default: { text: "Ada" } } }))).toBe("Ada");
  });

  it("falls back to the entity keys only when there is no text bucket", () => {
    expect(formatCell(column(DisplayType.TEXT), submission({ w1: { default: { entity: ["a", "b"] } } }))).toBe("a, b");
    expect(formatCell(column(DisplayType.TEXT), submission({ w1: { default: { entity: ["gone"], text: "" } } }))).toBe(
      EMPTY_CELL,
    );
  });

  it("parses numbers from the text bucket", () => {
    expect(formatCell(column(DisplayType.NUMBER), submission({ w1: { default: { text: "1234" } } }))).toBe(
      (1234).toLocaleString(),
    );
    expect(formatCell(column(DisplayType.NUMBER), submission({ w1: { default: { text: "abc" } } }))).toBe(EMPTY_CELL);
  });

  it("formats timestamps by display type", () => {
    const display = { w1: { default: { date: TIMESTAMP } } };

    expect(formatCell(column(DisplayType.DATE), submission(display))).toBe(new Date(TIMESTAMP).toLocaleDateString());
    expect(formatCell(column(DisplayType.TIME), submission(display))).toBe(new Date(TIMESTAMP).toLocaleTimeString());
    expect(formatCell(column(DisplayType.DATETIME), submission(display))).toBe(new Date(TIMESTAMP).toLocaleString());
  });

  it("is empty for a missing value or a template the column has no widget for", () => {
    expect(formatCell(column(DisplayType.DATE), submission({ w1: { default: { date: null } } }))).toBe(EMPTY_CELL);
    expect(formatCell(column(DisplayType.TEXT), submission({}))).toBe(EMPTY_CELL);
    expect(formatCell(column(DisplayType.TEXT), submission({ w1: { default: { text: "x" } } }, "other"))).toBe(EMPTY_CELL);
  });
});
