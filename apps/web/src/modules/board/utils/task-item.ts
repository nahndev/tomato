import { ValueType } from "@tomato/constants";
import type { BoardTaskSetting, Submission } from "../board.types";
import { parseLabel } from "./display-value";

export interface TaskItemValues {
  type: string | null;
  title: string;
  status: string | null;
  assigneeIds: string[];
}

function widgetLabel(submission: Submission, widgetId: string | null | undefined): string | null {
  return widgetId ? parseLabel(submission.dataDisplays[widgetId]?.[ValueType.DEFAULT]) : null;
}

export function getTaskItem(
  submission: Submission,
  setting: BoardTaskSetting | undefined,
  templateName: string | undefined,
): TaskItemValues {
  const assignees = setting?.assigneeWidget ? submission.data[setting.assigneeWidget] : undefined;
  return {
    type: widgetLabel(submission, setting?.typeWidget),
    title: widgetLabel(submission, setting?.titleWidget) || submission.title || templateName || "Untitled",
    status: widgetLabel(submission, setting?.statusWidget),
    assigneeIds: Array.isArray(assignees) ? assignees.filter((id): id is string => typeof id === "string") : [],
  };
}
