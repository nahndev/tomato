import type { WidgetPropertyKey } from "../../template-editor.types";

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
} as const satisfies Record<string, WidgetPropertyKey>;
