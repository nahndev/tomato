import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { DataScopeProvider } from "../components/data-scope-provider";
import { TemplateDataProvider } from "../components/template-data-provider";

export function renderInScope<T>(hook: () => T, scope: readonly string[], values?: Record<string, unknown>) {
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      TemplateDataProvider,
      { value: { widgets: {}, links: {}, values } },
      createElement(DataScopeProvider, { scope, children }),
    );
  return renderHook(hook, { wrapper }).result.current;
}
