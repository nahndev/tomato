import { WidgetType } from "@tomato/constants";
import { WidgetComponents, type WidgetComponentRegistry } from "@/modules/template-widget";
import { FormCanvasWidgetItem } from "./form-canvas-widget-item";
import { FormMixedViewWidgetItem } from "./form-mixed-view-widget-item";
import { FormRepeatViewWidgetItem } from "./form-repeat-view-widget-item";

export const FormWidgetComponents: WidgetComponentRegistry = {
  ...WidgetComponents,
  [WidgetType.CANVAS]: FormCanvasWidgetItem,
  [WidgetType.MIXED_VIEW]: FormMixedViewWidgetItem,
  [WidgetType.REPEAT_VIEW]: FormRepeatViewWidgetItem,
};
