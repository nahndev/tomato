import { WidgetType } from "@tomato/constants";
import type { Session, Widget } from "@/shared/types/template.types";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { DataScopeProvider } from "../components/data-scope-provider";
import { SessionValidationProvider } from "../components/session-validation-provider";
import { TemplateDataProvider } from "../components/template-data-provider";
import { useSessionValidity } from "./use-session-validity";
import { useWidgetValidation } from "./use-widget-validation";

const tab: Session = { id: "tab", name: "Tab", nested: { type: "widget", uuid: "mixed" } };
const widgets: Record<string, Widget> = Object.fromEntries(
  [
    { id: "name", type: WidgetType.TEXT, label: "Name", required: true },
    { id: "note", type: WidgetType.TEXT, label: "Note" },
    { id: "mixed", type: WidgetType.MIXED_VIEW, label: "Mixed", tabs: [tab] },
    { id: "sign", type: WidgetType.SIGNATURE, label: "Sign", required: true },
  ].map((widget) => [widget.id, widget as Widget]),
);
const widgetToSession = { name: "s1", note: "s1", mixed: "s1", sign: "tab" };

function render<T>(hook: () => T, values?: Record<string, unknown>, scope: string[] = []) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TemplateDataProvider widgets={widgets} links={{}} widgetToSession={widgetToSession} values={values}>
      <SessionValidationProvider sessionId="s1">
        <DataScopeProvider scope={scope}>{children}</DataScopeProvider>
      </SessionValidationProvider>
    </TemplateDataProvider>
  );
  return renderHook(hook, { wrapper }).result.current;
}

describe("useSessionValidity", () => {
  it("validates the values of the session", () => {
    expect(render(useSessionValidity, { name: "Ada" })).toBe(false);
    expect(render(useSessionValidity, { name: "Ada", "mixed.tab.sign": "data:" })).toBe(true);
  });

  it("is unknown without values", () => {
    expect(render(useSessionValidity)).toBeUndefined();
  });
});

describe("useWidgetValidation", () => {
  it("gives the result of a widget", () => {
    expect(render(() => useWidgetValidation("name"), {})?.isValid).toBe(false);
    expect(render(() => useWidgetValidation("name"), { name: "Ada" })).toEqual({ isValid: true, issues: [] });
    expect(render(() => useWidgetValidation("note"), {})?.isValid).toBe(true);
  });

  it("reads a nested widget under its data scope", () => {
    expect(render(() => useWidgetValidation("sign"), {}, ["mixed", "tab"])?.isValid).toBe(false);
    expect(render(() => useWidgetValidation("sign"), { "mixed.tab.sign": "data:" }, ["mixed", "tab"])?.isValid).toBe(
      true,
    );
  });

  it("gives nothing for a widget outside the schema", () => {
    expect(render(() => useWidgetValidation("unknown"), {})).toBeUndefined();
  });
});
