import { TaskField } from '@tomato/constants';

const TaskWidgetKey = {
  [TaskField.TYPE]: 'typeWidget',
  [TaskField.TITLE]: 'titleWidget',
  [TaskField.STATUS]: 'statusWidget',
  [TaskField.ASSIGNEE]: 'assigneeWidget',
} as const satisfies Record<TaskField, string>;
type TaskWidgetKey = (typeof TaskWidgetKey)[TaskField];

type TaskEntry = Partial<Record<TaskWidgetKey, string | null>>;

export class BoardTaskSettings {
  static conditionsOf<TEntry extends { conditions: unknown[] }>(
    setting: Record<string, TEntry>,
    templateId: string,
  ): TEntry['conditions'] | [] {
    return setting[templateId]?.conditions ?? [];
  }

  static pick<TEntry>(setting: Record<string, TEntry>, templateIds: Set<string>): Record<string, TEntry> {
    return Object.fromEntries(Object.entries(setting).filter(([id]) => templateIds.has(id)));
  }

  static widgetOf(entry: TaskEntry | undefined, field: TaskField): string | null {
    return entry?.[TaskWidgetKey[field]] ?? null;
  }

  static valuesOf(entry: TaskEntry | undefined, changes: Partial<Record<TaskField, unknown>>): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    for (const field of Object.values(TaskField)) {
      const widgetId = BoardTaskSettings.widgetOf(entry, field);
      if (widgetId && changes[field] !== undefined) values[widgetId] = changes[field];
    }
    return values;
  }
}
