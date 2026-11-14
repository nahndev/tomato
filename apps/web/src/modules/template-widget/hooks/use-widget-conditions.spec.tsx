import { ButtonConditionType, WidgetType } from "@tomato/constants";
import { SessionValidationProvider, TemplateDataProvider } from "@/modules/template-data";
import type { Widget } from "@/shared/types/template.types";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { useWidgetConditions } from "./use-widget-conditions";

const button: Widget = { id: "send", type: WidgetType.BUTTON, label: "Send" };
const guarded: Widget = { ...button, conditions: { [ButtonConditionType.REQUIRED_FILLED]: {} } };
const submit: Widget = { id: "submit", type: WidgetType.SUBMIT_BUTTON, label: "Submit" };
const name: Widget = { id: "name", type: WidgetType.TEXT, label: "Name", required: true };

function render(widget: Widget, isValid: boolean) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TemplateDataProvider
      widgets={{ name }}
      links={{}}
      widgetToSession={{ name: "s1" }}
      values={isValid ? { name: "Ada" } : {}}
    >
      <SessionValidationProvider sessionId="s1">{children}</SessionValidationProvider>
    </TemplateDataProvider>
  );
  return renderHook(() => useWidgetConditions(widget), { wrapper }).result.current;
}

describe("useWidgetConditions", () => {
  it("is met without conditions", () => {
    expect(render(button, false)).toEqual({ conditions: {}, isMet: true });
  });

  it("follows the session validity for required-filled", () => {
    expect(render(guarded, false)).toEqual({ conditions: { [ButtonConditionType.REQUIRED_FILLED]: false }, isMet: false });
    expect(render(guarded, true).isMet).toBe(true);
  });

  it("always checks required-filled on a submit button", () => {
    expect(render(submit, false).isMet).toBe(false);
    expect(render(submit, true).isMet).toBe(true);
  });

  it("is met outside a form", () => {
    expect(renderHook(() => useWidgetConditions(submit)).result.current.isMet).toBe(true);
  });
});
