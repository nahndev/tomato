import { ApiCallMethod, ApiCallResponseType, WidgetType } from "@tomato/constants";
import type { OptionItem, WidgetProperties } from "@tomato/types";
import { generateId } from "@tomato/utils";
import { generateKeyBetween } from "fractional-indexing";
import { ColorEnum } from "../template-editor.constants";

function defaultOptions(labels: string[]): OptionItem[] {
  let lastIndex: string | null = null;
  return labels.map((value) => {
    const index = generateKeyBetween(lastIndex, null);
    lastIndex = index;
    return { key: generateId(), value, index };
  });
}

export const DEFAULT_SETTINGS: Record<WidgetType, WidgetProperties> = {
  [WidgetType.TEXT]: { label: "Text field", placeholder: "Enter text…" },
  [WidgetType.TEXT_AREA]: { label: "Text area field", placeholder: "Enter text…" },
  [WidgetType.NUMBER]: { label: "Number field", placeholder: "0" },
  [WidgetType.DATE]: { label: "Date field" },
  [WidgetType.DATETIME]: { label: "Date & time field" },
  [WidgetType.TIME]: { label: "Time field" },
  [WidgetType.SELECT]: { label: "Select field", options: defaultOptions(["Option 1", "Option 2"]) },
  [WidgetType.CHECKBOX]: { label: "Checkbox field", options: defaultOptions(["Option 1", "Option 2"]) },
  [WidgetType.RADIO]: { label: "Radio field", options: defaultOptions(["Option 1", "Option 2"]) },
  [WidgetType.LABEL]: { label: "Label" },
  [WidgetType.SIGNATURE]: { label: "Signature" },
  [WidgetType.BUTTON]: {
    label: "Click me",
    containerStyle: { background: ColorEnum.GRAY },
    textStyle: { color: ColorEnum.WHITE },
  },
  [WidgetType.IMAGE_UPLOADER]: { label: "Image upload field" },
  [WidgetType.FILE_UPLOADER]: { label: "File upload field" },
  [WidgetType.BOARD]: { label: "Board" },
  [WidgetType.BREAK]: { label: "Break", compact: true },
  [WidgetType.SESSION]: { label: "Session" },
  [WidgetType.USERS]: { label: "User field" },
  [WidgetType.CREATED_AT]: { label: "Created At" },
  [WidgetType.TEMPLATE]: { label: "Template" },
  [WidgetType.SUBMITTED_BY]: { label: "By" },
  [WidgetType.API_CALL]: {
    label: "API call",
    apiCall: {
      method: ApiCallMethod.GET,
      url: "",
      params: [],
      headers: [],
      response: { type: ApiCallResponseType.JSON, show: false, jsonMappings: [] },
    },
  },
};
