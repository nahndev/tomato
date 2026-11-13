import { WidgetBehaviorType, WidgetType } from "@tomato/constants";
import type { WidgetProperties } from "@/shared/types/template.types";

export const TemplateMode = {
  VIEW: "view",
  EDIT: "edit",
} as const;
export type TemplateMode = (typeof TemplateMode)[keyof typeof TemplateMode];

export const COPILOT_RUNTIME_URL = "/rest/copilotkit";
export const COPILOT_SILENT_ERROR_CODES: readonly string[] = ["runtime_info_fetch_failed"];

export const DEFAULT_SESSION_ID = "default-session";
export const DEFAULT_SESSION_NAME = "Section 1";
export const NEW_SESSION_NAME = "New session";
export const DEFAULT_TAB_NAMES: readonly string[] = ["Tab 1", "Tab 2"];
export const NEW_TAB_NAME = "New tab";
export const CONTENT_SESSION_KEYS: readonly (keyof WidgetProperties)[] = ["session", "tabs"];
export const SYSTEM_WIDGET_ID_PREFIX = "system-";
export const WIDGET_BEHAVIORS: Partial<Record<WidgetType, readonly WidgetBehaviorType[]>> = {
  [WidgetType.REFER_SUBMISSION]: [WidgetBehaviorType.REFER_SUBMISSION],
};

export const TOOLBAR_DOCKED_WIDTH = "w-[25em]";
export const DEFAULT_COLOR = "#ffffff";

export const COLOR_PRESETS = [
  "#ffffff",
  "#f8fafc",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#64748b",
  "#0f172a",
];

/** Widget types whose content is a grid of other widgets. */
export const CONTAINER_WIDGET_TYPES: readonly WidgetType[] = [
  WidgetType.CANVAS,
  WidgetType.MIXED_VIEW,
  WidgetType.REPEAT_VIEW,
];

/** Their behavior runs on top-level values only (see `SubmissionBehaviorsService`), so they never go inside a container. */
export const TOP_LEVEL_WIDGET_TYPES: readonly WidgetType[] = [WidgetType.REFER_SUBMISSION];
