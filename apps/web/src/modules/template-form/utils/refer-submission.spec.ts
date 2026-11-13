import { LinkDeleteAction, LinkTargetType, WidgetBehaviorType, WidgetType } from "@tomato/constants";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { describe, expect, it } from "vitest";
import { getPendingReferAppliedAt, getReferSteps } from "./refer-submission";

const SNAPSHOT = {
  name: "Request",
  widgets: {
    people: { id: "people", type: WidgetType.USERS, label: "Approvers" },
    refer: { id: "refer", type: WidgetType.REFER_SUBMISSION, label: "Approvals" },
  },
  layouts: {},
  widgetToSession: {},
  sessions: {},
  links: { refer: { [LinkTargetType.WIDGET]: { uuid: "people", onDelete: LinkDeleteAction.CASCADE } } },
  behaviors: { refer: [WidgetBehaviorType.REFER_SUBMISSION] },
} as unknown as TemplateSnapshot;

describe("getReferSteps", () => {
  it("marks each user as created, to create or to delete", () => {
    expect(getReferSteps(["ada", "bob"], { ada: "/a", cid: "/c" })).toEqual([
      { userId: "ada", href: "/a", status: "created" },
      { userId: "bob", href: undefined, status: "will-create" },
      { userId: "cid", href: "/c", status: "will-delete" },
    ]);
  });
});

describe("getPendingReferAppliedAt", () => {
  it("returns the apply time while the steps still have changes", () => {
    const values = { people: ["ada"], refer: "2026-01-01T00:00:00.000Z" };

    expect(getPendingReferAppliedAt(SNAPSHOT, values, {})).toBe("2026-01-01T00:00:00.000Z");
    expect(getPendingReferAppliedAt(SNAPSHOT, values, { refer: { ada: "/a" } })).toBeUndefined();
    expect(getPendingReferAppliedAt(SNAPSHOT, { people: ["ada"] }, {})).toBeUndefined();
  });
});
