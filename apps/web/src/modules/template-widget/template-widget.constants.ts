import type { UserFilePickerOptions } from "@/modules/file";
import { ButtonConditionType, WidgetType } from "@tomato/constants";
import { EditorIconKey } from "./template-widget.icons";

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

export const DEFAULT_SESSION_ICON = EditorIconKey.CLOCK;

export const ReferStepStatus = {
  CREATED: "created",
  WILL_CREATE: "will-create",
  WILL_DELETE: "will-delete",
} as const;
export type ReferStepStatus = (typeof ReferStepStatus)[keyof typeof ReferStepStatus];

export const REFER_SUBMISSION_APPLY_TIMEOUT_MS = 30_000;

export const FILE_UPLOADER_PICKER_OPTIONS: UserFilePickerOptions = {
  multiple: true,
};

export const BUTTON_CONDITION_ITEMS: Record<ButtonConditionType, { label: string; description: string }> = {
  [ButtonConditionType.REQUIRED_FILLED]: {
    label: "Required fields filled",
    description: "The button stays disabled until every required field of its session has a value.",
  },
};

export const LOCKED_BUTTON_CONDITIONS: Partial<Record<WidgetType, readonly ButtonConditionType[]>> = {
  [WidgetType.SUBMIT_BUTTON]: [ButtonConditionType.REQUIRED_FILLED],
};
