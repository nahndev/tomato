import type { DisplayType } from "@tomato/constants";
import type { BoardColumn } from "@tomato/types";

export type ColumnDraft = Omit<BoardColumn, "type"> & { type: DisplayType | null };
