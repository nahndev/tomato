import { WidgetType } from "@tomato/constants";
import type { OptionItem, Session, TemplateSnapshot, Widget } from "@tomato/types";
import { generateKeyBetween } from "fractional-indexing";

let counter = 0;

function mockId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function getMockWidget(overrides?: Partial<Widget>): Widget {
  return { id: mockId("widget"), type: WidgetType.TEXT, label: "Widget", ...overrides };
}

export function getMockSession(overrides?: Partial<Session>): Session {
  return { id: mockId("session"), name: "Session", ...overrides };
}

let lastMockOptionIndex: string | null = null;

export function getMockOption(overrides?: Partial<OptionItem>): OptionItem {
  const index = generateKeyBetween(lastMockOptionIndex, null);
  lastMockOptionIndex = index;
  return { key: mockId("option"), value: "Option", index, ...overrides };
}

export function getMockTemplateSnapshot(overrides?: Partial<TemplateSnapshot>): TemplateSnapshot {
  return { name: "Template", widgets: {}, layouts: {}, widgetToSession: {}, sessions: {}, ...overrides };
}
