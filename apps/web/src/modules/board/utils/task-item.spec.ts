import { describe, expect, it } from "vitest";
import type { BoardTaskSetting, Submission } from "../board.types";
import { getTaskItem } from "./task-item";

const SETTING: BoardTaskSetting = {
  templateId: "template-a",
  typeWidget: "w-type",
  titleWidget: "w-title",
  statusWidget: "w-status",
  assigneeWidget: "w-users",
  conditions: [],
};

function submission(overrides: Partial<Submission> = {}): Submission {
  return {
    id: "s1",
    templateVersionId: "v1",
    templateVersion: { templateId: "template-a" },
    data: { "w-users": ["u1", 2, "u2"] },
    dataDisplays: {
      "w-type": { default: { entity: ["bug"], text: "Bug" } },
      "w-title": { default: { text: "Fix login" } },
      "w-status": { default: { entity: ["todo"], text: "To do" } },
    },
    title: "Submission title",
    createdAt: "",
    updatedAt: "",
    ...overrides,
  };
}

describe("getTaskItem", () => {
  it("reads the type, title, status and assignees of the setting widgets", () => {
    expect(getTaskItem(submission(), SETTING, "Issues")).toEqual({
      type: "Bug",
      title: "Fix login",
      status: "To do",
      assigneeIds: ["u1", "u2"],
    });
  });

  it("falls back to the submission title, then the template name", () => {
    const empty = submission({ dataDisplays: { "w-title": { default: { text: "" } } } });
    expect(getTaskItem(empty, SETTING, "Issues").title).toBe("Submission title");
    expect(getTaskItem({ ...empty, title: "" }, SETTING, "Issues").title).toBe("Issues");
    expect(getTaskItem({ ...empty, title: "" }, SETTING, undefined).title).toBe("Untitled");
  });

  it("leaves the fields empty without a setting", () => {
    expect(getTaskItem(submission(), undefined, "Issues")).toEqual({
      type: null,
      title: "Submission title",
      status: null,
      assigneeIds: [],
    });
  });
});
