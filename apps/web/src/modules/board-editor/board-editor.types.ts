import type { DisplayType } from "@tomato/constants";
import type { BoardColumn } from "@/modules/board";

export type ColumnDraft = Omit<BoardColumn, "type"> & { type: DisplayType | null };
