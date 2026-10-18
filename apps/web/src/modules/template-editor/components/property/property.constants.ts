import type { WidgetPropertyKey } from "../../template-editor.types";

export const PropertyKey = {
  LABEL: "label",
  PLACEHOLDER: "placeholder",
  REQUIRED: "required",
  OPTIONS: "options",
  CONTENT: "content",
  ACTIONS: "actions",
  API_CALL: "apiCall",
  TEXT_STYLE: "textStyle",
  CONTAINER_STYLE: "containerStyle",
} as const satisfies Record<string, WidgetPropertyKey>;
