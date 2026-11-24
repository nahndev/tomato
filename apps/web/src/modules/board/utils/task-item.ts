import { TaskField } from "@tomato/constants";
import { BoardTaskSettings } from "@tomato/protocol";
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
  const assigneeWidget = BoardTaskSettings.widgetOf(setting, TaskField.ASSIGNEE);
  const assignees = assigneeWidget ? submission.data[assigneeWidget] : undefined;
  return {
    type: getWidgetLabel(submission, BoardTaskSettings.widgetOf(setting, TaskField.TYPE)),
    title: getWidgetLabel(submission, BoardTaskSettings.widgetOf(setting, TaskField.TITLE)) || submission.title || templateName || "Untitled",
    status: getWidgetLabel(submission, BoardTaskSettings.widgetOf(setting, TaskField.STATUS)),
    assigneeIds: Array.isArray(assignees) ? assignees.filter((id): id is string => typeof id === "string") : [],
  };
}
