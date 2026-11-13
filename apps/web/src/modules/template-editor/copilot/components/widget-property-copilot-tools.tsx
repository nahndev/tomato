"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useTemplateSnapshot } from "../../components/provider/template-snapshot-provider";
import { useWidgetActions } from "../../sync/hooks/use-widget-actions";
import { toWidgetProperties, widgetPropertiesInputSchema } from "../utils/widget-properties-input";

const setWidgetPropertiesParametersSchema = z.object({
  widgetId: z.string().describe("Id of the widget to change."),
  properties: widgetPropertiesInputSchema.describe("Only the properties to change; the others are left as they are."),
});

export function WidgetPropertyCopilotTools() {
  const widgets = useTemplateSnapshot((snapshot) => snapshot.widgets);
  const { setProperties } = useWidgetActions();

  useFrontendTool(
    {
      name: "setWidgetProperties",
      description:
        "Change one or more properties of a widget in the template: label, placeholder, required, options, content, actions, compact, textStyle, containerStyle.",
      parameters: setWidgetPropertiesParametersSchema,
      handler: async ({ widgetId, properties }) => {
        const widget = widgets[widgetId];
        if (!widget) return `Error: no widget with id "${widgetId}".`;

        const changes = toWidgetProperties(properties, widget);
        const keys = Object.keys(changes);
        if (keys.length === 0) return "Error: no properties were given.";

        setProperties(widgetId, changes);
        return `Set ${keys.join(", ")} of widget ${widgetId}.`;
      },
    },
    [widgets, setProperties],
  );

  return null;
}
