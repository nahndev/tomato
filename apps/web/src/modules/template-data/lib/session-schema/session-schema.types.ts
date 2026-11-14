import type { Widget } from "@/shared/types/template.types";
import type { z } from "zod";

export interface WidgetSchemaContext {
  widget: Widget;
  scope: string[];
  buildSession: (schema: z.ZodObject, sessionId: string, scope: string[]) => z.ZodObject;
}

export interface WidgetSchemaStrategy {
  build: (schema: z.ZodObject, context: WidgetSchemaContext) => z.ZodObject;
}
