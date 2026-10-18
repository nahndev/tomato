import { WidgetType } from "@tomato/constants";
import type { WidgetPropertyRegistry } from "../../template-editor.types";
import { PropertyKey } from "./property.constants";

const { LABEL, PLACEHOLDER, REQUIRED, OPTIONS, CONTENT, ACTIONS, API_CALL, TEXT_STYLE, CONTAINER_STYLE } = PropertyKey;

/** Property keys shown per widget type, in display order. */
export const WIDGET_PROPERTY_REGISTRY: WidgetPropertyRegistry = {
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
  [WidgetType.USERS]: [LABEL, REQUIRED],
  [WidgetType.CREATED_AT]: [LABEL],
  [WidgetType.TEMPLATE]: [LABEL],
  [WidgetType.SUBMITTED_BY]: [LABEL],
  [WidgetType.API_CALL]: [LABEL, API_CALL],
};
