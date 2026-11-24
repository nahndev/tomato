import { JsonBoardTaskView } from "@tomato/utils";
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
  const assigneeWidget = JsonBoardTaskView.getAssigneeWidget(setting);
  const assignees = assigneeWidget ? submission.data[assigneeWidget] : undefined;
  return {
    type: getWidgetLabel(submission, JsonBoardTaskView.getTypeWidget(setting)),
    title: getWidgetLabel(submission, JsonBoardTaskView.getTitleWidget(setting)) || submission.title || templateName || "Untitled",
    status: getWidgetLabel(submission, JsonBoardTaskView.getStatusWidget(setting)),
    assigneeIds: Array.isArray(assignees) ? assignees.filter((id): id is string => typeof id === "string") : [],
  };
}
