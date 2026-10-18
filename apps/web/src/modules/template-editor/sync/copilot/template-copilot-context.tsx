"use client";

import { useAgentContext } from "@copilotkit/react-core/v2";
import { useMemo } from "react";
import { useWidgetSelection } from "../../components/provider/template-provider";
import { useTemplateMeta } from "../../hooks/use-template-meta";
import { useTemplateState } from "../../hooks/use-template-state";
import {
  describeGrid,
  describePropertyMeanings,
  describeSelection,
  describeSessions,
  describeTemplate,
  describeWidgetTypes,
} from "./copilot-template-context";

/** Registers what the copilot knows about the form beyond its widgets. Renders nothing. */
export function TemplateCopilotContext() {
  const { name, sessions, layouts, widgets, widgetToSession } = useTemplateState();
  const { version } = useTemplateMeta();
  const { selected } = useWidgetSelection();

  const grid = useMemo(describeGrid, []);
  const widgetTypes = useMemo(describeWidgetTypes, []);
  const propertyMeanings = useMemo(describePropertyMeanings, []);

  useAgentContext({
    description:
      "The form template being built. A template is a form: a list of sessions (wizard steps) holding widgets (fields) that people fill in and submit.",
    value: describeTemplate(name, version),
  });

  useAgentContext({
    description: "The grid widgets are placed on. Use it to judge widths and which widgets share a row.",
    value: grid,
  });

  useAgentContext({
    description:
      "Every widget type: whether it produces a value, the properties it supports (`settableProperties`) and its default grid layout. Only set properties a type supports; use a type for what it is meant for.",
    value: widgetTypes,
  });

  useAgentContext({ description: "What each widget property means.", value: propertyMeanings });

  // JSON strings drop the unset (undefined) fields, which the context's JSON value type does not accept.
  useAgentContext({
    description:
      "The template's sessions (name, icon, description, when shown) and, in placement order (top to bottom), the widgets in each with their grid column, span, full-width and static flags. Properties of a widget are in the widgets context, by `widgetId`.",
    value: useMemo(
      () => JSON.stringify(describeSessions({ sessions, layouts, widgets, widgetToSession })),
      [sessions, layouts, widgets, widgetToSession],
    ),
  });

  useAgentContext({
    description:
      'What the user has selected in the builder. `widget` is the selected widget (null when none): its properties, the properties its type can set, its grid layout, its session, its place in that session and the widgets right before and after it. `currentSession` is the session the user is working in: the selected widget\'s, or the first session while no widget is selected (`derivedFrom` says which). Requests like "this field", "the selected widget", "this section" or "add a field here" mean these; use their ids in tools.',
    value: useMemo(
      () => JSON.stringify(describeSelection({ selected, sessions, layouts, widgets, widgetToSession })),
      [selected, sessions, layouts, widgets, widgetToSession],
    ),
  });

  return null;
}
