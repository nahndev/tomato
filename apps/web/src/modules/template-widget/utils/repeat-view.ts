import type { Widget } from "@/shared/types/template.types";
import { REPEAT_LINK_WIDGET_TYPES } from "../template-widget.constants";

export function isRepeatLinkWidget(widget: Widget): boolean {
  return REPEAT_LINK_WIDGET_TYPES.includes(widget.type);
}
