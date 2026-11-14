import type { TemplateDataValue } from "../../template-data.types";
import { z } from "zod";
import { WidgetSchemaStrategies } from "./widget-schema-strategies";

export class SessionSchemaBuilder {
  constructor(private readonly data: Pick<TemplateDataValue, "widgets" | "widgetToSession">) {}

  build(sessionId: string): z.ZodObject {
    return this.buildSession(z.object({}), sessionId, []);
  }

  private buildSession(schema: z.ZodObject, sessionId: string, scope: string[]): z.ZodObject {
    return Object.values(this.data.widgets)
      .filter((widget) => this.data.widgetToSession[widget.id] === sessionId)
      .reduce(
        (current, widget) =>
          WidgetSchemaStrategies[widget.type].build(current, {
            widget,
            scope,
            buildSession: (nested, nestedSessionId, nestedScope) => this.buildSession(nested, nestedSessionId, nestedScope),
          }),
        schema,
      );
  }
}
