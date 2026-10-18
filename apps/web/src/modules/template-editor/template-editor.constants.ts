
export const TemplateMode = {
  VIEW: "view",
  EDIT: "edit",
} as const;
export type TemplateMode = (typeof TemplateMode)[keyof typeof TemplateMode];

export const ColorEnum = {
  RED: "#ef4444",
  ORANGE: "#f97316",
  YELLOW: "#eab308",
  GREEN: "#22c55e",
  BLUE: "#3b82f6",
  PURPLE: "#a855f7",
  PINK: "#ec4899",
  GRAY: "#6b7280",
  WHITE: "#ffffff",
} as const;
export type ColorEnum = (typeof ColorEnum)[keyof typeof ColorEnum];

export const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_URL ?? "ws://localhost:3003";
export const COPILOT_RUNTIME_URL = "/copilotkit";
export const COPILOT_SILENT_ERROR_CODES: readonly string[] = ["runtime_info_fetch_failed"];

export const DEFAULT_SESSION_ID = "default-session";
export const DEFAULT_SESSION_NAME = "Section 1";
export const NEW_SESSION_NAME = "New session";
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

export interface ApiCallHost {
  id: string;
  label: string;
  baseUrl: string;
}

export const API_CALL_HOSTS: ApiCallHost[] = [
  { id: "staging", label: "Staging", baseUrl: "https://staging.api.example.com" },
  { id: "production", label: "Production", baseUrl: "https://api.example.com" },
];
