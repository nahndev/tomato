import { Badge, Typography } from "@tomato/ui";
import Link from "next/link";
import { getSubmissionPath } from "@/modules/submission-dependency";
import type { TaskItemValues } from "../../utils/task-item";

interface TaskItemProps {
  submissionId: string;
  item: TaskItemValues;
  assigneeNames: string[];
}

export function TaskItem({ submissionId, item, assigneeNames }: TaskItemProps) {
  return (
    <li className="relative flex items-center gap-3 border-b border-border px-4 py-2 text-sm last:border-b-0 hover:bg-muted">
      {item.type && <Badge variant="outline">{item.type}</Badge>}
      <Link
        href={getSubmissionPath(submissionId)}
        className="min-w-0 flex-1 truncate font-medium after:absolute after:inset-0 hover:underline"
      >
        {item.title}
      </Link>
      {item.status && <Badge>{item.status}</Badge>}
      <Typography as="span" className="w-40 shrink-0 truncate text-right text-muted-foreground">
        {assigneeNames.length > 0 ? assigneeNames.join(", ") : "Unassigned"}
      </Typography>
    </li>
  );
}
