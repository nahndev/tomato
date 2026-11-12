import { WidgetType } from "@tomato/constants";
import { REFER_LINK_WIDGET_TYPES, REPEAT_LINK_WIDGET_TYPES } from "@/modules/template-widget";
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
  LINK_WIDGET_UUID: "linkWidgetUuid",
  LINK_TEMPLATE_UUID: "linkTemplateUuid",
} as const satisfies Record<string, WidgetPropertyKey>;

export const LINK_WIDGET_CHOICES: Partial<Record<WidgetType, { types: readonly WidgetType[]; hint: string }>> = {
  [WidgetType.REPEAT_VIEW]: { types: REPEAT_LINK_WIDGET_TYPES, hint: "One tab per option (or user) of this widget." },
  [WidgetType.REFER_SUBMISSION]: { types: REFER_LINK_WIDGET_TYPES, hint: "One submission per user of this widget." },
};
