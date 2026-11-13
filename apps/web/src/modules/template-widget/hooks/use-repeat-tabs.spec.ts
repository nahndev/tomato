import { WidgetType } from "@tomato/constants";
import type { Widget } from "@/shared/types/template.types";
import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { TemplateDataProvider } from "@/modules/template-data";
import { useRepeatTabs } from "./use-repeat-tabs";

const WIDGETS: Record<string, Widget> = {
  room: {
    id: "room",
    type: WidgetType.RADIO,
    label: "Room",
    options: [
      { key: "k2", value: "Kitchen", index: "a1" },
      { key: "k1", value: "Bedroom", index: "a0" },
    ],
  },
  text: { id: "text", type: WidgetType.TEXT, label: "", options: [{ key: "k", value: "v", index: "a0" }] },
};

function wrapper({ children }: { children: ReactNode }) {
  return createElement(TemplateDataProvider, { value: { widgets: WIDGETS, links: {} } }, children);
}

describe("useRepeatTabs", () => {
  it("builds one tab per option of the linked widget, in option order, keyed by the option key", () => {
    const { result } = renderHook(() => useRepeatTabs("room"), { wrapper });

    expect(result.current).toEqual([
      { id: "k1", name: "Bedroom" },
      { id: "k2", name: "Kitchen" },
    ]);
  });

  it("has no tabs without a linked widget, for an unknown id, or for a widget that can't be one", () => {
    expect(renderHook(() => useRepeatTabs(undefined), { wrapper }).result.current).toEqual([]);
    expect(renderHook(() => useRepeatTabs("missing"), { wrapper }).result.current).toEqual([]);
    expect(renderHook(() => useRepeatTabs("text"), { wrapper }).result.current).toEqual([]);
  });

  it("keeps the same tabs while the options are unchanged", () => {
    const { result, rerender } = renderHook(() => useRepeatTabs("room"), { wrapper });
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });
});
