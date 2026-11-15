import type { DisplayType, TaskConditionOperation } from "@tomato/constants";
import type { BoardColumn, BoardTaskSetting } from "@/modules/board";

export type ColumnDraft = Omit<BoardColumn, "type"> & { type: DisplayType | null };

export interface TaskConditionDraft {
  id: string;
  widget: string | null;
  operation: TaskConditionOperation;
  value: string | null;
}

export type TaskSettingDraft = Omit<BoardTaskSetting, "conditions"> & { conditions: TaskConditionDraft[] };
