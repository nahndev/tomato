import { TaskField } from '@tomato/constants';

type TaskWidgetKey = `${TaskField}Widget`;

export class JsonBoardTaskView {
  static getWidget<TSetting extends Partial<Record<TaskWidgetKey, string | null>>>(
    setting: TSetting | undefined,
    field: TaskField,
  ): string | null {
    return setting?.[`${field}Widget`] ?? null;
  }

  static getTypeWidget<TSetting extends { typeWidget?: string | null }>(setting?: TSetting): string | null {
    return JsonBoardTaskView.getWidget(setting, TaskField.TYPE);
  }

  static getTitleWidget<TSetting extends { titleWidget?: string | null }>(setting?: TSetting): string | null {
    return JsonBoardTaskView.getWidget(setting, TaskField.TITLE);
  }

  static getStatusWidget<TSetting extends { statusWidget?: string | null }>(setting?: TSetting): string | null {
    return JsonBoardTaskView.getWidget(setting, TaskField.STATUS);
  }

  static getAssigneeWidget<TSetting extends { assigneeWidget?: string | null }>(setting?: TSetting): string | null {
    return JsonBoardTaskView.getWidget(setting, TaskField.ASSIGNEE);
  }
}
