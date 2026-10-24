import { DisplayType, ValueType } from "@tomato/constants";
import type { ColumnSize } from "@tomato/types";

export const BOARDS_PATH = "/system/boards";
export const getBoardPath = (id: string) => `${BOARDS_PATH}/${id}`;

export const BoardTab = {
  SUBMISSIONS: "submissions",
  COLUMNS: "columns",
} as const;
export type BoardTab = (typeof BoardTab)[keyof typeof BoardTab];

export const BOARD_LIST_PAGE_SIZE = 100;
export const SUBMISSION_LIST_PAGE_SIZE = 100;

export const DEFAULT_COLUMN_SIZE: ColumnSize = { flex: 1 };
export const COLUMN_WIDTH_STEPS = [100, 200, 300, 400, 500, 600, 800, 1000, 1200];
export const COLUMN_FLEX_STEPS = [1, 2, 3, 4, 5];

export const DISPLAY_TYPE_LABELS: Record<DisplayType, string> = {
  [DisplayType.TEXT]: "Text",
  [DisplayType.DATE]: "Date",
  [DisplayType.TIME]: "Time",
  [DisplayType.DATETIME]: "Date & time",
  [DisplayType.NUMBER]: "Number",
};

export const VALUE_TYPE_LABELS: Record<ValueType, string> = {
  [ValueType.DEFAULT]: "Default",
  [ValueType.DATE]: "Date",
  [ValueType.TIME]: "Time",
};

export const EMPTY_CELL = "—";
