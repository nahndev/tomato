"use client";

import { useAgentContext, useFrontendTool } from "@copilotkit/react-core/v2";
import type { WidgetType } from "@tomato/constants";
import { generateId } from "@tomato/utils";
import { z } from "zod";
import { WidgetItemList, WidgetItems } from "@/modules/template-widget";
import { useTemplateSnapshot } from "../../components/provider/template-snapshot-provider";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { useWidgetActions } from "../../sync/hooks/use-widget-actions";
import { useTransaction } from "@/shared/lib/sync";
import { findLayoutError, toPlacementLayout, widgetLayoutInputSchema } from "../utils/widget-layout-input";
import { describeWidget } from "../utils/describe-template";
import { toWidgetProperties, widgetPropertiesInputSchema } from "../utils/widget-properties-input";
import { WidgetLayoutCopilotTools } from "./widget-layout-copilot-tools";
import { WidgetPropertyCopilotTools } from "./widget-property-copilot-tools";

const WIDGET_TYPES: readonly string[] = WidgetItemList.map((definition) => definition.type);

const addWidgetParametersSchema = z.object({
  type: z.string().describe("The widget type to add."),
  afterWidgetId: z
    .string()
    .optional()
    .describe("Id of the widget to insert right after. Omit to add at the end."),
  properties: widgetPropertiesInputSchema
    .optional()
    .describe("Properties to create the widget with. Omitted ones keep the widget type's defaults."),
  layout: widgetLayoutInputSchema
    .optional()
    .describe("Grid column / span / full width to create the widget with. Omitted ones keep the widget type's default layout."),
});

const removeWidgetParametersSchema = z.object({
  widgetId: z.string().describe("Id of the widget to remove."),
});

function isWidgetType(type: string): type is WidgetType {
  return WIDGET_TYPES.includes(type);
}

export function WidgetCopilotTools() {
  const widgets = useTemplateSnapshot((snapshot) => snapshot.widgets);
  const { addWidget, removeWidget, setProperties } = useWidgetActions();
  const { placeWidget } = useSessionActions();
  const transact = useTransaction();

  // A JSON string drops the unset (undefined) properties, which the context's JSON value type does not accept.
  useAgentContext({
    description:
      "Widgets currently in the template. Use `id` for tools; refer to widgets to the user by `label`.",
    value: JSON.stringify(Object.values(widgets).map(describeWidget)),
  });

  useFrontendTool(
    {
      name: "addWidget",
      description: "Add a new widget to the template, optionally with its properties and grid layout already set.",
      parameters: addWidgetParametersSchema,
      handler: async ({ type, afterWidgetId, properties, layout }) => {
        if (!isWidgetType(type)) return `Error: unknown widget type "${type}".`;
        const after = afterWidgetId ? widgets[afterWidgetId] : undefined;
        if (afterWidgetId && !after) return `Error: no widget with id "${afterWidgetId}".`;
        const layoutError = layout ? findLayoutError(layout, WidgetItems[type].defaultLayout) : null;
        if (layoutError) return layoutError;

        const id = generateId();
        transact(() => {
          addWidget(id, type, after ?? null);
          if (properties) setProperties(id, toWidgetProperties(properties));
          if (layout) placeWidget(id, { layout: toPlacementLayout(layout) });
        });
        return `Added ${type} widget with id ${id}.`;
      },
    },
    [widgets, addWidget, setProperties, placeWidget, transact],
  );

  useFrontendTool(
    {
      name: "removeWidget",
      description: "Remove a widget from the template.",
      parameters: removeWidgetParametersSchema,
      handler: async ({ widgetId }) => {
        if (!widgets[widgetId]) return `Error: no widget with id "${widgetId}".`;
        removeWidget(widgetId);
        return `Removed widget ${widgetId}.`;
      },
    },
    [widgets, removeWidget],
  );

  return (
    <>
      <WidgetPropertyCopilotTools />
      <WidgetLayoutCopilotTools />
    </>
  );
}
