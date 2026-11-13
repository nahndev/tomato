import type { Widget, WidgetLink } from "@/shared/types/template.types";

/** Referenced submission hrefs, by refer submission widget id, then user id. */
export type WidgetReferences = Record<string, Record<string, string>>;

/** Read-only template data shared by the widgets; each host (editor, form) provides its own. */
export interface TemplateStoreValue {
  widgets: Record<string, Widget>;
  links: Record<string, WidgetLink>;
  /** Filled-in values by scoped key; only a form provides them. */
  values?: Record<string, unknown>;
  references?: WidgetReferences;
}
