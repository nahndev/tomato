import type { z } from "zod";
import type { Widget, WidgetLink } from "@/shared/types/template.types";

/** Read-only template data shared by the widgets; each host (editor, form) provides its own. */
export interface TemplateDataValue {
  widgets: Record<string, Widget>;
  links: Record<string, WidgetLink>;
  widgetToSession: Record<string, string>;
  values?: Record<string, unknown>;
}

export interface WidgetValidation {
  isValid: boolean;
  issues: z.core.$ZodIssue[];
}

export interface SessionValidationValue {
  sessionId?: string;
  schema?: z.ZodObject;
  isValid?: boolean;
  issues: z.core.$ZodIssue[];
  results: Record<string, WidgetValidation>;
}
