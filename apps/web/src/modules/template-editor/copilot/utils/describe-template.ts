import { COLUMN_WIDTH, CONTAINER_MIN_HEIGHT, GRID_COLUMNS } from "@tomato/grid";
import { LinkTargetType, SessionConditionType } from "@tomato/constants";
import type { GridLayout, Session, SessionCondition, TemplateSnapshot, Widget } from "@/shared/types/template.types";
import { DEFAULT_LAYOUT, WidgetItemList, sortOptions } from "@/modules/template-widget";
import { WIDGET_PROPERTY_KEYS } from "../../template-editor.constants";
import type { WidgetPropertyKey } from "../../template-editor.types";
import { richTextStateToText } from "./rich-text";
import { findContainerWidgetId, getTopSessionId } from "../../utils/container-widget";

/** Keyed by every property key, so a new `WidgetProperties` key fails to compile until it is described. */
const PROPERTY_MEANINGS: Record<WidgetPropertyKey, string> = {
  label: "Text shown above the field (the field's name). Also how the user refers to the widget.",
  placeholder: "Hint shown inside an empty field.",
  required: "The submitter must fill the field before submitting.",
  options: "Choices of a select / checkbox / radio widget, as plain strings in display order.",
  content: "Static text of a label widget; a new line starts a new paragraph.",
  url: "Legacy button link; use `actions` instead.",
  actions: "Button only: actions run in order on click - open a link or send a mail.",
  compact: "Break only: render with less height.",
  textStyle: "CSS (camelCase) of the widget's text, e.g. color.",
  containerStyle: "CSS (camelCase) of the widget's box, e.g. background.",
  session: "Canvas only, set automatically: the session holding the widgets inside the canvas. Not settable.",
  tabs: "Mixed view only: its tabs in order, each a session holding the widgets shown in that tab. Not settable.",
  linkWidgetUuid:
    "Repeat view: id of the widget whose options become its tabs. Refer submission: id of the users widget that gets one submission per user. See `linkedWidgetId`. Not settable.",
  linkTemplateUuid:
    "Refer submission only: id of the template each created submission uses (see `linkedTemplateId`). Not settable.",
  departmentUuid: "Users only: id of the department whose users can be picked; every department when unset. Not settable.",
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
    settableProperties: WIDGET_PROPERTY_KEYS[definition.type],
    defaultLayout: describeLayout(definition.defaultLayout),
  }));
}

export function describePropertyMeanings() {
  return PROPERTY_MEANINGS;
}

function describeCondition(condition: SessionCondition | undefined) {
  return condition ?? { type: SessionConditionType.ALWAYS };
}

type SessionsState = Pick<TemplateSnapshot, "sessions" | "layouts" | "widgets" | "widgetToSession"> &
  Partial<Pick<TemplateSnapshot, "links">>;

function orderedSessionWidgets(state: SessionsState, sessionId: string) {
  const { layouts, widgets, widgetToSession } = state;
  return Object.keys(widgets)
    .filter((widgetId) => widgetToSession[widgetId] === sessionId)
    .map((widgetId) => ({ widgetId, layout: layouts[widgetId] ?? DEFAULT_LAYOUT }))
    .sort((a, b) => (a.layout.idx > b.layout.idx ? 1 : -1));
}

function describeLaidOutWidgets(state: SessionsState, sessionId: string) {
  return orderedSessionWidgets(state, sessionId).map(({ widgetId, layout }) => ({ widgetId, ...describeLayout(layout) }));
}

/** A canvas's widgets sit in its own content session (`widget.session`), a mixed view's in one session per tab (`widget.tabs`). */
function describeSessionWidgets(state: SessionsState, sessionId: string) {
  return describeLaidOutWidgets(state, sessionId).map((widget) => {
    const { session, tabs } = state.widgets[widget.widgetId] ?? {};
    const link = state.links?.[widget.widgetId];
    const linkedWidgetId = link?.[LinkTargetType.WIDGET]?.uuid;
    const linkedTemplateId = link?.[LinkTargetType.TEMPLATE]?.uuid;
    if (session) {
      return {
        ...widget,
        ...(linkedWidgetId && { linkedWidgetId }),
        content: { sessionId: session.id, widgets: describeLaidOutWidgets(state, session.id) },
      };
    }
    if (tabs) {
      return {
        ...widget,
        tabs: tabs.map((tab) => ({ sessionId: tab.id, name: tab.name, widgets: describeLaidOutWidgets(state, tab.id) })),
      };
    }
    return { ...widget, ...(linkedWidgetId && { linkedWidgetId }), ...(linkedTemplateId && { linkedTemplateId }) };
  });
}

export function describeSessions(state: SessionsState) {
  return Object.values(state.sessions).map((session: Session) => ({
    id: session.id,
    name: session.name,
    icon: session.icon,
    description: session.description && richTextStateToText(session.description),
    showWhen: describeCondition(session.condition),
    widgets: describeSessionWidgets(state, session.id),
  }));
}

export function describeTemplate(name: string, version: string | undefined) {
  return { name, publishedVersion: version ?? "never published" };
}

interface SelectionState extends SessionsState {
  selected: Widget | null;
}

function describeSelectedWidget(state: SelectionState, selected: Widget, session: Session | undefined) {
  const ownSessionId = state.widgetToSession[selected.id];
  const siblings = ownSessionId ? orderedSessionWidgets(state, ownSessionId) : [];
  const index = siblings.findIndex(({ widgetId }) => widgetId === selected.id);

  return {
    widgetId: selected.id,
    type: selected.type,
    label: selected.label,
    properties: describeWidget(selected),
    settableProperties: WIDGET_PROPERTY_KEYS[selected.type],
    layout: describeLayout(state.layouts[selected.id] ?? DEFAULT_LAYOUT),
    session: session ? { id: session.id, name: session.name } : null,
    canvasId: (ownSessionId && findContainerWidgetId(state.widgets, ownSessionId)) ?? null,
    position: index === -1 ? null : { index: index + 1, of: siblings.length },
    previousWidgetId: siblings[index - 1]?.widgetId ?? null,
    nextWidgetId: siblings[index + 1]?.widgetId ?? null,
  };
}

export function describeSelection(state: SelectionState) {
  const { selected, sessions, widgetToSession } = state;
  const ownSessionId = selected ? widgetToSession[selected.id] : undefined;
  const sessionId = ownSessionId && getTopSessionId(state, ownSessionId);
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

export function describeWidget(widget: Widget) {
  return {
    id: widget.id,
    type: widget.type,
    label: widget.label,
    placeholder: widget.placeholder,
    required: widget.required,
    options: widget.options && sortOptions(widget.options).map((option) => option.value),
    content: widget.content && richTextStateToText(widget.content),
    url: widget.url,
    actions: widget.actions,
    compact: widget.compact,
    textStyle: widget.textStyle,
    containerStyle: widget.containerStyle,
  };
}
