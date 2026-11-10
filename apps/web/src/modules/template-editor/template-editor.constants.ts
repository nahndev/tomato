
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
export const SYSTEM_WIDGET_ID_PREFIX = "system-";

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
