import type { ColumnSize } from "./board.types";

export const BoardView = {
  TABLE: "table",
  TASK: "task",
  AGENDA: "agenda",
} as const;
export type BoardView = (typeof BoardView)[keyof typeof BoardView];

export const BOARD_LIST_PAGE_SIZE = 100;
export const SUBMISSION_LIST_PAGE_SIZE = 100;

export const DEFAULT_COLUMN_SIZE: ColumnSize = { flex: 1 };
