import { WidgetType } from "@tomato/constants";

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

export const REPEAT_LINK_WIDGET_TYPES: readonly WidgetType[] = [
  WidgetType.SELECT,
  WidgetType.CHECKBOX,
  WidgetType.RADIO,
  WidgetType.USERS,
];

export const REFER_LINK_WIDGET_TYPES: readonly WidgetType[] = [WidgetType.USERS];

export const USER_SHORT_ID_LENGTH = 8;

export const ReferStepStatus = {
  CREATED: "created",
  WILL_CREATE: "will-create",
  WILL_DELETE: "will-delete",
} as const;
export type ReferStepStatus = (typeof ReferStepStatus)[keyof typeof ReferStepStatus];

export const REFER_SUBMISSION_APPLY_TIMEOUT_MS = 30_000;
