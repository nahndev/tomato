import { DisplayType, ValueType } from "@tomato/constants";

export const COLUMN_WIDTH_STEPS = [100, 200, 300, 400, 500, 600, 800, 1000, 1200];
export const COLUMN_FLEX_STEPS = [1, 2, 3, 4, 5];

export const DISPLAY_TYPE_LABELS: Record<DisplayType, string> = {
  [DisplayType.TEXT]: "Text",
  [DisplayType.DATE]: "Date",
  [DisplayType.TIME]: "Time",
  [DisplayType.DATETIME]: "Date & time",
  [DisplayType.NUMBER]: "Number",
};

export const VALUE_TYPE_LABELS: Record<ValueType, string> = {
  [ValueType.DEFAULT]: "Default",
  [ValueType.DATE]: "Date",
  [ValueType.TIME]: "Time",
};
