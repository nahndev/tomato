import { WidgetBehaviorType, WidgetType } from "@tomato/constants";
import { REFER_LINK_WIDGET_TYPES, REPEAT_LINK_WIDGET_TYPES } from "@/modules/template-widget";
import type { WidgetProperties } from "@/shared/types/template.types";
import type { WidgetPropertyKey, WidgetPropertyKeys } from "./template-editor.types";

export const TemplateMode = {
  VIEW: "view",
  EDIT: "edit",
} as const;
export type TemplateMode = (typeof TemplateMode)[keyof typeof TemplateMode];

export const COPILOT_RUNTIME_URL = "/rest/copilotkit";
export const COPILOT_SILENT_ERROR_CODES: readonly string[] = ["runtime_info_fetch_failed"];

export const DEFAULT_SESSION_ID = "default-session";
export const CONTENT_SESSION_KEYS: readonly (keyof WidgetProperties)[] = ["session", "tabs"];
export const SYSTEM_WIDGET_ID_PREFIX = "system-";
export const WIDGET_BEHAVIORS: Partial<Record<WidgetType, readonly WidgetBehaviorType[]>> = {
  [WidgetType.REFER_SUBMISSION]: [WidgetBehaviorType.REFER_SUBMISSION],
};

export const ToolbarType = {
  WIDGET: "widget",
  STRUCTURE: "structure",
  PROPERTY: "property",
  VERSION: "version",
  CHAT: "chat",
} as const;
export type ToolbarType = (typeof ToolbarType)[keyof typeof ToolbarType];

export const ToolbarMode = {
  DOCKED: "docked",
  POPUP: "popup",
} as const;
export type ToolbarMode = (typeof ToolbarMode)[keyof typeof ToolbarMode];

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

export const PropertyKey = {
  LABEL: "label",
  PLACEHOLDER: "placeholder",
  REQUIRED: "required",
  OPTIONS: "options",
  TABS: "tabs",
  CONTENT: "content",
  ACTIONS: "actions",
  TEXT_STYLE: "textStyle",
  CONTAINER_STYLE: "containerStyle",
  LINK_WIDGET_UUID: "linkWidgetUuid",
  LINK_TEMPLATE_UUID: "linkTemplateUuid",
  DEPARTMENT_UUID: "departmentUuid",
} as const satisfies Record<string, WidgetPropertyKey>;

const { LABEL, PLACEHOLDER, REQUIRED, OPTIONS, TABS, CONTENT, ACTIONS, TEXT_STYLE, CONTAINER_STYLE, LINK_WIDGET_UUID, LINK_TEMPLATE_UUID, DEPARTMENT_UUID } =
  PropertyKey;

export const WIDGET_PROPERTY_KEYS: WidgetPropertyKeys = {
  [WidgetType.TEXT]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.TEXT_AREA]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.NUMBER]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.DATE]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.DATETIME]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.TIME]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.SELECT]: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  [WidgetType.CHECKBOX]: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  [WidgetType.RADIO]: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  [WidgetType.LABEL]: [LABEL, CONTENT],
  [WidgetType.SIGNATURE]: [LABEL, REQUIRED],
  [WidgetType.BUTTON]: [LABEL, ACTIONS, TEXT_STYLE, CONTAINER_STYLE],
  [WidgetType.IMAGE_UPLOADER]: [LABEL, REQUIRED],
  [WidgetType.FILE_UPLOADER]: [LABEL, REQUIRED],
  [WidgetType.BOARD]: [LABEL, REQUIRED],
  [WidgetType.BREAK]: [],
  [WidgetType.SESSION]: [LABEL],
  [WidgetType.USERS]: [LABEL, REQUIRED, DEPARTMENT_UUID],
  [WidgetType.CREATED_AT]: [LABEL],
  [WidgetType.TEMPLATE]: [LABEL],
  [WidgetType.SUBMITTED_BY]: [LABEL],
  [WidgetType.CANVAS]: [LABEL],
  [WidgetType.MIXED_VIEW]: [LABEL, TABS],
  [WidgetType.REPEAT_VIEW]: [LABEL, LINK_WIDGET_UUID],
  [WidgetType.REFER_SUBMISSION]: [LABEL, LINK_WIDGET_UUID, LINK_TEMPLATE_UUID],
};

export const LINK_WIDGET_CHOICES: Partial<Record<WidgetType, { types: readonly WidgetType[]; hint: string }>> = {
  [WidgetType.REPEAT_VIEW]: { types: REPEAT_LINK_WIDGET_TYPES, hint: "One tab per option (or user) of this widget." },
  [WidgetType.REFER_SUBMISSION]: { types: REFER_LINK_WIDGET_TYPES, hint: "One submission per user of this widget." },
};

/** Radix `Select` items cannot have an empty value. */
export const ALL_DEPARTMENTS_VALUE = "all";
