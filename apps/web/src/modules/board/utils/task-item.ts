import type { BoardTaskSetting, Submission } from "../board.types";
import { getWidgetLabel } from "./display-value";

export interface TaskItemValues {
  type: string | null;
  title: string;
  status: string | null;
  assigneeIds: string[];
}

export function getTaskItem(
  submission: Submission,
  setting: BoardTaskSetting | undefined,
  templateName: string | undefined,
): TaskItemValues {
  const assignees = setting?.assigneeWidget ? submission.data[setting.assigneeWidget] : undefined;
  return {
    type: getWidgetLabel(submission, setting?.typeWidget),
    title: getWidgetLabel(submission, setting?.titleWidget) || submission.title || templateName || "Untitled",
    status: getWidgetLabel(submission, setting?.statusWidget),
    assigneeIds: Array.isArray(assignees) ? assignees.filter((id): id is string => typeof id === "string") : [],
  };
}
