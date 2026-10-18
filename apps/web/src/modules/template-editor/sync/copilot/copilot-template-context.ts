import { COLUMN_WIDTH, CONTAINER_MIN_HEIGHT, GRID_COLUMNS } from "@tomato/grid";
import { SessionConditionType } from "@tomato/constants";
import type { GridLayout, Session, SessionCondition, Widget } from "@tomato/types";
import { WidgetItemList } from "../../constants/widget-items.constants";
import { DEFAULT_LAYOUT } from "../../constants/widget-layouts.constants";
import { WIDGET_PROPERTY_REGISTRY } from "../../components/property/property-registry";
import type { TemplateState, WidgetPropertyKey } from "../../template-editor.types";
import { describeWidget, editorStateToText } from "./copilot-widget-properties";

/** Keyed by every property key, so a new `WidgetProperties` key fails to compile until it is described. */
const PROPERTY_MEANINGS: Record<WidgetPropertyKey, string> = {
  label: "Text shown above the field (the field's name). Also how the user refers to the widget.",
  placeholder: "Hint shown inside an empty field.",
  required: "The submitter must fill the field before submitting.",
  options: "Choices of a select / checkbox / radio widget, as plain strings in display order.",
  content: "Static text of a label widget; a new line starts a new paragraph.",
  url: "Legacy button link; use `actions` instead.",
  actions: "Button only: actions run in order on click - open a link or send a mail.",
  apiCall: "api-call widget only: HTTP request and how the response fills other widgets.",
  compact: "Break only: render with less height.",
  textStyle: "CSS (camelCase) of the widget's text, e.g. color.",
  containerStyle: "CSS (camelCase) of the widget's box, e.g. background.",
};

export function describeGrid() {
  return {
    columns: GRID_COLUMNS,
    columnWidthPx: COLUMN_WIDTH,
    containerMinHeightPx: CONTAINER_MIN_HEIGHT,
    rules: [
      `A session is a grid of ${GRID_COLUMNS} columns, numbered 0 to ${GRID_COLUMNS - 1}.`,
      `A widget starts at \`column\` and covers \`span\` columns (1 to ${GRID_COLUMNS}); column + span must not exceed ${GRID_COLUMNS}.`,
      "A full-width widget ignores column and span and covers the whole row.",
      "Widgets are placed top to bottom in order, each one below what is already in its columns, so two widgets share a row only when their columns do not overlap.",
      "A new widget gets its widget type's default column and span, and is placed right after `afterWidgetId` or at the end.",
      "To put widgets on one row, give them columns that do not overlap (e.g. column 0 span 4 and column 4 span 4) and place the second one right after the first. To put a widget on a row of its own, make it full width.",
    ],
  };
}

function describeLayout(layout: Omit<GridLayout, "idx">) {
  return {
    column: layout.column,
    span: layout.span,
    fullWidth: layout.isFullWidth ?? false,
    static: layout.isStatic ?? false,
  };
}

export function describeWidgetTypes() {
  return WidgetItemList.map((definition) => ({
    type: definition.type,
    label: definition.label,
    description: definition.description,
    group: definition.group,
    producesValue: definition.isDataField,
    settableProperties: WIDGET_PROPERTY_REGISTRY[definition.type],
    defaultLayout: describeLayout(definition.defaultLayout),
  }));
}

export function describePropertyMeanings() {
  return PROPERTY_MEANINGS;
}

function describeCondition(condition: SessionCondition | undefined) {
  return condition ?? { type: SessionConditionType.ALWAYS };
}

type SessionsState = Pick<TemplateState, "sessions" | "layouts" | "widgets" | "widgetToSession">;

function orderedSessionWidgets(state: SessionsState, sessionId: string) {
  const { layouts, widgets, widgetToSession } = state;
  return Object.keys(widgets)
    .filter((widgetId) => widgetToSession[widgetId] === sessionId)
    .map((widgetId) => ({ widgetId, layout: layouts[widgetId] ?? DEFAULT_LAYOUT }))
    .sort((a, b) => (a.layout.idx > b.layout.idx ? 1 : -1));
}

export function describeSessions(state: SessionsState) {
  return Object.values(state.sessions).map((session: Session) => ({
    id: session.id,
    name: session.name,
    icon: session.icon,
    description: session.description && editorStateToText(session.description),
    showWhen: describeCondition(session.condition),
    widgets: orderedSessionWidgets(state, session.id).map(({ widgetId, layout }) => ({
      widgetId,
      ...describeLayout(layout),
    })),
  }));
}

export function describeTemplate(name: string, version: string | undefined) {
  return { name, publishedVersion: version ?? "never published" };
}

interface SelectionState extends SessionsState {
  selected: Widget | null;
}

function describeSelectedWidget(state: SelectionState, selected: Widget, session: Session | undefined) {
  const siblings = session ? orderedSessionWidgets(state, session.id) : [];
  const index = siblings.findIndex(({ widgetId }) => widgetId === selected.id);

  return {
    widgetId: selected.id,
    type: selected.type,
    label: selected.label,
    properties: describeWidget(selected),
    settableProperties: WIDGET_PROPERTY_REGISTRY[selected.type],
    layout: describeLayout(state.layouts[selected.id] ?? DEFAULT_LAYOUT),
    session: session ? { id: session.id, name: session.name } : null,
    position: index === -1 ? null : { index: index + 1, of: siblings.length },
    previousWidgetId: siblings[index - 1]?.widgetId ?? null,
    nextWidgetId: siblings[index + 1]?.widgetId ?? null,
  };
}

/**
 * The selected widget with everything the model needs to act on it, plus the
 * session the user is working in: the selected widget's, or the first one.
 */
export function describeSelection(state: SelectionState) {
  const { selected, sessions, widgetToSession } = state;
  const sessionId = selected ? widgetToSession[selected.id] : undefined;
  const widgetSession = sessionId ? sessions[sessionId] : undefined;
  const currentSession = widgetSession ?? Object.values(sessions)[0];

  return {
    widget: selected && describeSelectedWidget(state, selected, widgetSession),
    currentSession: currentSession
      ? {
          id: currentSession.id,
          name: currentSession.name,
          derivedFrom: widgetSession ? "selected-widget" : "first-session",
        }
      : null,
  };
}
