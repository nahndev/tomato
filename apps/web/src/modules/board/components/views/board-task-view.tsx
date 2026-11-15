"use client";

import { Typography } from "@tomato/ui";
import { getUserFullName, useAllUsers } from "@/modules/user";
import { getTaskItem } from "../../utils/task-item";
import type { Board, Submission } from "../../board.types";
import { TaskItem } from "./task-item";

interface BoardTaskViewProps {
  board: Board;
  submissions: Submission[];
}

export function BoardTaskView({ board, submissions }: BoardTaskViewProps) {
  const { users } = useAllUsers();
  const userNames = new Map(users.map((user) => [user.id, getUserFullName(user)]));
  const templateNames = new Map(board.templates.map(({ templateId, template }) => [templateId, template.name]));

  if (submissions.length === 0) {
    return <Typography as="p" className="text-sm text-muted-foreground">No tasks.</Typography>;
  }

  return (
    <ul aria-label="Tasks" className="flex flex-col rounded-lg bg-card shadow-card">
      {submissions.map((submission) => {
        const { templateId } = submission.templateVersion;
        const item = getTaskItem(submission, board.task?.settings[templateId], templateNames.get(templateId));
        return (
          <TaskItem
            key={submission.id}
            submissionId={submission.id}
            item={item}
            assigneeNames={item.assigneeIds.map((id) => userNames.get(id) ?? id)}
          />
        );
      })}
    </ul>
  );
}
