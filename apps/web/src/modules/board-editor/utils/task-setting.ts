import { TaskConditionOperation } from "@tomato/constants";
import type { Board, BoardTaskCondition, BoardTaskSetting } from "@/modules/board";
import { generateId } from "@tomato/utils";
import type { TaskConditionDraft, TaskSettingDraft } from "../board-editor.types";

export function createTaskCondition(): TaskConditionDraft {
  return { id: generateId(), widget: null, operation: TaskConditionOperation.IS, value: null };
}

export function toTaskSettingDrafts({ templates }: Board): TaskSettingDraft[] {
  return templates.map(({ templateId, taskSetting }) => ({
    templateId,
    typeWidget: taskSetting?.typeWidget ?? null,
    titleWidget: taskSetting?.titleWidget ?? null,
    statusWidget: taskSetting?.statusWidget ?? null,
    assigneeWidget: taskSetting?.assigneeWidget ?? null,
    conditions: (taskSetting?.conditions ?? []).map((condition) => ({ id: generateId(), ...condition })),
  }));
}

function isConditionReady(condition: TaskConditionDraft): condition is TaskConditionDraft & BoardTaskCondition {
  return condition.widget !== null && condition.value !== null;
}

export function prepareTaskSettings(drafts: TaskSettingDraft[]): BoardTaskSetting[] | null {
  const conditions = drafts.flatMap((draft) => draft.conditions);
  if (!conditions.every(isConditionReady)) return null;

  return drafts
    .map((draft) => ({
      ...draft,
      conditions: draft.conditions.map(({ widget, operation, value }) => ({ widget, operation, value }) as BoardTaskCondition),
    }))
    .filter(
      (setting) =>
        setting.conditions.length > 0 ||
        [setting.typeWidget, setting.titleWidget, setting.statusWidget, setting.assigneeWidget].some((widget) => widget !== null),
    );
}
