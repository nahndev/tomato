import { WidgetType } from "@tomato/constants";
import type { GridLayout } from "@tomato/types";

export const DEFAULT_LAYOUT: GridLayout = { column: 0, span: 2, idx: "a" };

export const DEFAULT_LAYOUTS: Record<WidgetType, Omit<GridLayout, "idx">> = {
  [WidgetType.TEXT]: { column: 0, span: 2 },
  [WidgetType.TEXT_AREA]: { column: 0, span: 4 },
  [WidgetType.NUMBER]: { column: 0, span: 2 },
  [WidgetType.DATE]: { column: 0, span: 2 },
  [WidgetType.DATETIME]: { column: 0, span: 2 },
  [WidgetType.TIME]: { column: 0, span: 2 },
  [WidgetType.SELECT]: { column: 0, span: 2 },
  [WidgetType.CHECKBOX]: { column: 0, span: 2 },
  [WidgetType.RADIO]: { column: 0, span: 2 },
  [WidgetType.LABEL]: { column: 0, span: 4 },
  [WidgetType.SIGNATURE]: { column: 0, span: 4 },
  [WidgetType.BUTTON]: { column: 0, span: 1 },
  [WidgetType.IMAGE_UPLOADER]: { column: 0, span: 2 },
  [WidgetType.FILE_UPLOADER]: { column: 0, span: 2 },
  [WidgetType.BOARD]: { column: 0, span: 4 },
  [WidgetType.BREAK]: { column: 0, span: 4, isFullWidth: true, isStatic: true },
  [WidgetType.SESSION]: { column: 0, span: 4, isFullWidth: true, isStatic: false },
  [WidgetType.USERS]: { column: 0, span: 2 },
  [WidgetType.CREATED_AT]: { column: 0, span: 2 },
  [WidgetType.TEMPLATE]: { column: 0, span: 2 },
  [WidgetType.SUBMITTED_BY]: { column: 0, span: 2 },
  [WidgetType.API_CALL]: { column: 0, span: 2 },
};
