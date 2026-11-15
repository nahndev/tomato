import { TaskConditionOperation } from "@tomato/constants";
import type { Board, BoardTaskCondition, BoardTaskSettingInput } from "@/modules/board";
import { generateId } from "@tomato/utils";
import type { TaskConditionDraft, TaskSettingDraft } from "../board-editor.types";

export function createTaskCondition(): TaskConditionDraft {
  return { id: generateId(), widget: null, operation: TaskConditionOperation.IS, value: null };
}

export function toTaskSettingDrafts({ templates, task }: Board): TaskSettingDraft[] {
  return templates.map(({ templateId }) => {
    const setting = task?.settings[templateId];
    return {
      templateId,
      typeWidget: setting?.typeWidget ?? null,
      titleWidget: setting?.titleWidget ?? null,
      statusWidget: setting?.statusWidget ?? null,
      assigneeWidget: setting?.assigneeWidget ?? null,
      conditions: (setting?.conditions ?? []).map((condition) => ({ id: generateId(), ...condition })),
    };
  });
}

function isConditionReady(condition: TaskConditionDraft): condition is TaskConditionDraft & BoardTaskCondition {
  return condition.widget !== null && condition.value !== null;
}

export function prepareTaskSettings(drafts: TaskSettingDraft[]): BoardTaskSettingInput[] | null {
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
