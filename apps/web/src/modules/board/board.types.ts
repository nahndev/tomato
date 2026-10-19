import type { DisplayType } from "@tomato/constants";
import type { BoardColumn } from "@tomato/types";

/** A column being edited; `type` stays unset until the user (or the picked widgets) decide it. */
export type ColumnDraft = Omit<BoardColumn, "type"> & { type: DisplayType | null };
