import { TaskConditionOperation } from "@tomato/constants";
import type { Board } from "@/modules/board";
import { describe, expect, it } from "vitest";
import type { TaskSettingDraft } from "../board-editor.types";
import { createTaskCondition, prepareTaskSettings, toTaskSettingDrafts } from "./task-setting";

const TEMPLATE_A = "template-a";
const TEMPLATE_B = "template-b";
const CONDITION = { widget: "w-status", operation: TaskConditionOperation.IS_NOT, value: "done" };

function draft(overrides: Partial<TaskSettingDraft> = {}): TaskSettingDraft {
  return {
    templateId: TEMPLATE_A,
    typeWidget: null,
    titleWidget: null,
    statusWidget: null,
    assigneeWidget: null,
    conditions: [],
    ...overrides,
  };
}

describe("toTaskSettingDrafts", () => {
  it("gives every linked template a draft, filled from its saved setting", () => {
    const board = {
      templates: [
        { templateId: TEMPLATE_A, taskSetting: { ...draft({ statusWidget: "w-status" }), conditions: [CONDITION] } },
        { templateId: TEMPLATE_B, taskSetting: null },
      ],
    } as unknown as Board;

    const drafts = toTaskSettingDrafts(board);

    expect(drafts.map((entry) => [entry.templateId, entry.statusWidget])).toEqual([
      [TEMPLATE_A, "w-status"],
      [TEMPLATE_B, null],
    ]);
    expect(drafts[0].conditions).toEqual([{ id: expect.any(String), ...CONDITION }]);
  });
});

describe("prepareTaskSettings", () => {
  it("drops empty settings and strips the condition ids", () => {
    const settings = prepareTaskSettings([
      draft({ typeWidget: "w-type", conditions: [{ id: "c1", ...CONDITION }] }),
      draft({ templateId: TEMPLATE_B }),
    ]);

    expect(settings).toEqual([{ ...draft({ typeWidget: "w-type" }), conditions: [CONDITION] }]);
  });

  it("is null while a condition is incomplete", () => {
    expect(prepareTaskSettings([draft({ conditions: [createTaskCondition()] })])).toBeNull();
  });
});
