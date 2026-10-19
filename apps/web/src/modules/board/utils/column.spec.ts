import { DisplayType, ValueType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import type { ColumnDraft } from "../board.types";
import { createColumn, decodeColumnSize, encodeColumnSize, getColumnSizeStyle, prepareColumns, setColumnItem } from "./column";

const TEMPLATE_A = "template-a";
const TEMPLATE_B = "template-b";
const ITEM = { widgetId: "w1", property: ValueType.DEFAULT };

function ready(overrides: Partial<ColumnDraft> = {}): ColumnDraft {
  return { ...createColumn(), type: DisplayType.TEXT, label: "Name", items: { [TEMPLATE_A]: ITEM }, ...overrides };
}

describe("setColumnItem", () => {
  it("sets and removes the item of a template", () => {
    const column = setColumnItem(createColumn(), TEMPLATE_A, ITEM);
    expect(column.items).toEqual({ [TEMPLATE_A]: ITEM });

    expect(setColumnItem(column, TEMPLATE_A, null).items).toEqual({});
  });
});

describe("prepareColumns", () => {
  it("drops columns without widgets and trims labels", () => {
    const columns = prepareColumns([ready({ label: "  Name  " }), createColumn()], [TEMPLATE_A]);

    expect(columns).toHaveLength(1);
    expect(columns?.[0].label).toBe("Name");
  });

  it("drops items of templates that are no longer linked", () => {
    const columns = prepareColumns([ready({ items: { [TEMPLATE_A]: ITEM, [TEMPLATE_B]: ITEM } })], [TEMPLATE_A]);

    expect(Object.keys(columns?.[0].items ?? {})).toEqual([TEMPLATE_A]);
  });

  it("returns null while a column with widgets has no label or type", () => {
    expect(prepareColumns([ready({ label: " " })], [TEMPLATE_A])).toBeNull();
    expect(prepareColumns([ready({ type: null })], [TEMPLATE_A])).toBeNull();
  });

  it("accepts a board without columns", () => {
    expect(prepareColumns([], [])).toEqual([]);
  });
});

describe("column size", () => {
  it("round-trips through the select encoding", () => {
    expect(decodeColumnSize(encodeColumnSize({ flex: 2 }))).toEqual({ flex: 2 });
    expect(decodeColumnSize(encodeColumnSize({ width: 300 }))).toEqual({ width: 300 });
  });

  it("maps a size to a style", () => {
    expect(getColumnSizeStyle({ flex: 2 })).toEqual({ flex: "2 1 0%" });
    expect(getColumnSizeStyle({ width: 300 })).toEqual({ width: 300, flexShrink: 0 });
  });
});
