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

/** Widget types whose content is a grid of other widgets. */
export const CONTAINER_WIDGET_TYPES: readonly WidgetType[] = [
  WidgetType.CANVAS,
  WidgetType.MIXED_VIEW,
  WidgetType.REPEAT_VIEW,
];

export const REPEAT_LINK_WIDGET_TYPES: readonly WidgetType[] = [
  WidgetType.SELECT,
  WidgetType.CHECKBOX,
  WidgetType.RADIO,
  WidgetType.USERS,
];

export const REFER_LINK_WIDGET_TYPES: readonly WidgetType[] = [WidgetType.USERS];

export const USER_SHORT_ID_LENGTH = 8;
