import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { DataScopeProvider } from "../components/data-scope-provider";
import { TemplateStoreProvider } from "../components/template-store-provider";
import { useScopedValue } from "./use-scoped-value";
import { useWidgetValue } from "./use-widget-value";

const VALUES = { people: ["top"], "repeat.a.people": ["tab-a"] };

function renderInScope<T>(hook: () => T, scope: readonly string[], values?: Record<string, unknown>) {
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      TemplateStoreProvider,
      { value: { widgets: {}, links: {}, values } },
      createElement(DataScopeProvider, { scope, children }),
    );
  return renderHook(hook, { wrapper }).result.current;
}

describe("useWidgetValue", () => {
  it("reads a widget of the same tab before an outer one", () => {
    expect(renderInScope(() => useWidgetValue("people"), ["repeat", "a"], VALUES)).toEqual(["tab-a"]);
    expect(renderInScope(() => useWidgetValue("people"), ["repeat", "b"], VALUES)).toEqual(["top"]);
  });

  it("is undefined without values, as in the editor", () => {
    expect(renderInScope(() => useWidgetValue("people"), [])).toBeUndefined();
  });
});

describe("useScopedValue", () => {
  it("reads exactly the given key", () => {
    expect(renderInScope(() => useScopedValue("repeat.b.people"), [], VALUES)).toBeUndefined();
    expect(renderInScope(() => useScopedValue("repeat.a.people"), [], VALUES)).toEqual(["tab-a"]);
  });
});
