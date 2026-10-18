import { SessionConditionType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import { evaluateSessionCondition } from "./session-condition";

describe("evaluateSessionCondition", () => {
  it("shows a session without a condition", () => {
    expect(evaluateSessionCondition(undefined, {})).toBe(true);
    expect(evaluateSessionCondition({ type: SessionConditionType.ALWAYS }, {})).toBe(true);
  });

  it("shows a session once its button was clicked", () => {
    const condition = { type: SessionConditionType.BUTTON_CLICKED, widgetId: "b1" } as const;

    expect(evaluateSessionCondition(condition, {})).toBe(false);
    expect(evaluateSessionCondition(condition, { b1: true })).toBe(true);
  });

  it.each([
    [undefined, false],
    [null, false],
    ["", false],
    [[], false],
    ["text", true],
    [0, true],
    [["a"], true],
  ])("treats %j as a value: %s", (value, expected) => {
    const condition = { type: SessionConditionType.WIDGET_HAS_VALUE, widgetId: "w1" } as const;

    expect(evaluateSessionCondition(condition, { w1: value })).toBe(expected);
  });
});
