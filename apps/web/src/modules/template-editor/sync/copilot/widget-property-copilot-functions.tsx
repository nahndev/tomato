"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useTemplateState } from "../../hooks/use-template-state";
import { useWidgetActions } from "../hooks/use-widget-actions";
import { findUnknownWidgetIds, toWidgetProperties, widgetPropertiesInput } from "./copilot-widget-properties";

const setWidgetPropertiesParameters = z.object({
  widgetId: z.string().describe("Id of the widget to change."),
  properties: widgetPropertiesInput.describe("Only the properties to change; the others are left as they are."),
});

/** Registers the tool that edits the properties of an existing widget. Renders nothing. */
export function WidgetPropertyCopilotFunctions() {
  const { widgets } = useTemplateState();
  const { setProperties } = useWidgetActions();

  useFrontendTool(
    {
      name: "setWidgetProperties",
      description:
        "Change one or more properties of a widget in the template: label, placeholder, required, options, content, actions, apiCall, compact, textStyle, containerStyle.",
      parameters: setWidgetPropertiesParameters,
      handler: async ({ widgetId, properties }) => {
        const widget = widgets[widgetId];
        if (!widget) return `Error: no widget with id "${widgetId}".`;

        const unknownIds = findUnknownWidgetIds(properties, widgets);
        if (unknownIds.length > 0) {
          return `Error: no widget with id ${unknownIds.map((id) => `"${id}"`).join(", ")}.`;
        }

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
