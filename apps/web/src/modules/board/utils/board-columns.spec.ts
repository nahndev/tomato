import { DisplayType, ValueType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import type { Board } from "../board.types";
import { getBoardColumns } from "./board-columns";

const ITEM_A = { widgetId: "w-a", property: ValueType.DEFAULT };
const ITEM_B = { widgetId: "w-b", property: ValueType.DEFAULT };

describe("getBoardColumns", () => {
  it("joins each column with the items its templates set for it", () => {
    const board = {
      tableColumns: [
        { id: "c1", type: DisplayType.TEXT, size: { flex: 1 }, label: "Name" },
        { id: "c2", type: DisplayType.TEXT, size: { flex: 1 }, label: "Note" },
      ],
      templates: [
        { templateId: "template-a", tableSetting: { templateId: "template-a", items: { c1: ITEM_A, c2: ITEM_A } } },
        { templateId: "template-b", tableSetting: { templateId: "template-b", items: { c1: ITEM_B } } },
        { templateId: "template-c", tableSetting: null },
      ],
    } as unknown as Board;

    expect(getBoardColumns(board).map(({ id, items }) => [id, items])).toEqual([
      ["c1", { "template-a": ITEM_A, "template-b": ITEM_B }],
      ["c2", { "template-a": ITEM_A }],
    ]);
  });
});
