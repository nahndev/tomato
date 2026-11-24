import { Typography } from "@tomato/ui";
import type { Board, Submission, TaskChanges } from "../../board.types";
import { TaskItem } from "./task-item";

interface BoardTaskViewProps {
  board: Board;
  submissions: Submission[];
  onUpdate: (id: string, changes: TaskChanges) => Promise<void>;
}

export function BoardTaskView({ board, submissions, onUpdate }: BoardTaskViewProps) {
  const templates = new Map(board.templates.map(({ templateId, template }) => [templateId, template]));

  if (submissions.length === 0) {
    return <Typography as="p" className="text-sm text-muted-foreground">No tasks.</Typography>;
  }

  return (
    <ul aria-label="Tasks" className="flex flex-col gap-2">
      {submissions.map((submission) => {
        const { templateId } = submission.templateVersion;
        const template = templates.get(templateId);
        return (
          <TaskItem
            key={submission.id}
            submission={submission}
            setting={board.taskSetting[templateId]}
            snapshot={template?.versions[0]?.snapshot}
            templateName={template?.name}
            onUpdate={onUpdate}
          />
        );
      })}
    </ul>
  );
}
