"use client";

import { toast } from "@tomato/ui";
import { TaskField } from "@tomato/constants";
import { BoardTaskSettings } from "@tomato/protocol";
import { useState } from "react";
import { getSubmissionPath } from "@/modules/submission-dependency";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { getTaskItem } from "../../utils/task-item";
import type { BoardTaskSetting, Submission, TaskChanges } from "../../board.types";
import { Assignee } from "./assignee";
import { TaskOptionSelect } from "./task-option-select";
import { TaskTitle } from "./task-title";

interface TaskItemProps {
  submission: Submission;
  setting: BoardTaskSetting | undefined;
  snapshot: TemplateSnapshot | undefined;
  templateName: string | undefined;
  onUpdate: (id: string, changes: TaskChanges) => Promise<void>;
}

export function TaskItem({ submission, setting, snapshot, templateName, onUpdate }: TaskItemProps) {
  const [draft, setDraft] = useState<TaskChanges>({});
  const item = getTaskItem(submission, setting, templateName);
  const typeWidget = BoardTaskSettings.widgetOf(setting, TaskField.TYPE);
  const statusWidget = BoardTaskSettings.widgetOf(setting, TaskField.STATUS);
  const assigneeWidget = BoardTaskSettings.widgetOf(setting, TaskField.ASSIGNEE);

  async function update(changes: TaskChanges) {
    setDraft((current) => ({ ...current, ...changes }));
    try {
      await onUpdate(submission.id, changes);
    } catch {
      toast.error("Could not update the task");
    } finally {
      setDraft((current) => {
        const next = { ...current };
        for (const field of Object.keys(changes)) delete next[field as keyof TaskChanges];
        return next;
      });
    }
  }

  return (
    <li className="group relative flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-card motion-base hover:bg-muted/50">
      <TaskOptionSelect
        widget={typeWidget ? snapshot?.widgets[typeWidget] : undefined}
        value={draft.type ?? (typeWidget ? submission.data[typeWidget] : undefined)}
        label={item.type}
        placeholder="Type"
        className="neutral"
        onChange={(type) => void update({ type })}
      />
      <TaskTitle
        title={draft.title ?? item.title}
        href={getSubmissionPath(submission.id)}
        onChange={(title) => void update({ title })}
      />
      <TaskOptionSelect
        widget={statusWidget ? snapshot?.widgets[statusWidget] : undefined}
        value={draft.status ?? (statusWidget ? submission.data[statusWidget] : undefined)}
        label={item.status}
        placeholder="Status"
        onChange={(status) => void update({ status })}
      />
      <Assignee
        userIds={draft.assignee ?? item.assigneeIds}
        departmentId={assigneeWidget ? snapshot?.widgets[assigneeWidget]?.departmentUuid : undefined}
        onChange={assigneeWidget ? (assignee) => void update({ assignee }) : undefined}
      />
    </li>
  );
}
