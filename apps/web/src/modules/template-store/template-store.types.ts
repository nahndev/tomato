import type { Widget, WidgetLink } from "@/shared/types/template.types";

/** Read-only template data shared by the widgets; each host (editor, form) provides its own. */
export interface TemplateStoreValue {
  widgets: Record<string, Widget>;
  links: Record<string, WidgetLink>;
  values?: Record<string, unknown>;
}
