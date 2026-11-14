import { WidgetType } from "@tomato/constants";
import { WidgetComponents, type WidgetComponentRegistry } from "@/modules/template-widget";
import { EditorCanvasWidgetItem } from "./editor-canvas-widget-item";
import { EditorMixedViewWidgetItem } from "./editor-mixed-view-widget-item";
import { EditorRepeatViewWidgetItem } from "./editor-repeat-view-widget-item";

export const EditorWidgetComponents: WidgetComponentRegistry = {
  ...WidgetComponents,
  [WidgetType.CANVAS]: EditorCanvasWidgetItem,
  [WidgetType.MIXED_VIEW]: EditorMixedViewWidgetItem,
  [WidgetType.REPEAT_VIEW]: EditorRepeatViewWidgetItem,
};
