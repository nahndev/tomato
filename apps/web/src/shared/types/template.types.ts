import type {
  ButtonActionType,
  LinkDeleteAction,
  LinkTargetType,
  RecipientType,
  SessionConditionType,
  SessionNestedType,
  WidgetType,
} from "@tomato/constants";

export interface RichTextState {
  root: Record<string, unknown>;
}

export type StyleProperties = Record<string, string | number>;

export interface OptionItem {
  key: string;
  value: string;
  index: string;
}

export interface Recipient {
  type: RecipientType;
  value: string;
}

export interface LinkAction {
  type: typeof ButtonActionType.LINK;
  url: string;
}

export interface MailAction {
  type: typeof ButtonActionType.MAIL;
  recipients: Recipient[];
  subject: string;
  body: string;
}

export type ButtonAction = LinkAction | MailAction;

export interface WidgetProperties {
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: OptionItem[];
  content?: RichTextState;
  url?: string;
  actions?: ButtonAction[];
  compact?: boolean;
  textStyle?: StyleProperties;
  containerStyle?: StyleProperties;
  session?: Session;
  /** `mixed-view` only: one session per tab, in tab order. */
  tabs?: Session[];
  linkWidgetUuid?: string;
}

export interface Widget extends WidgetProperties {
  id: string;
  type: WidgetType;
}

export interface GridLayout {
  column: number;
  span: number;
  idx: string;
  isStatic?: boolean;
  isFullWidth?: boolean;
}

export interface AlwaysCondition {
  type: typeof SessionConditionType.ALWAYS;
}

export interface ButtonClickedCondition {
  type: typeof SessionConditionType.BUTTON_CLICKED;
  widgetId: string;
}

export interface WidgetHasValueCondition {
  type: typeof SessionConditionType.WIDGET_HAS_VALUE;
  widgetId: string;
}

export type SessionCondition =
  | AlwaysCondition
  | ButtonClickedCondition
  | WidgetHasValueCondition;

export interface SessionProperties {
  name: string;
  icon?: string;
  description?: RichTextState;
  condition?: SessionCondition;
}

export interface SessionNested {
  type: SessionNestedType;
  uuid: string;
}

export interface Session extends SessionProperties {
  id: string;
  /** Set on the session that holds a container widget's content (`canvas`): `uuid` is that widget's id. */
  nested?: SessionNested;
}

export interface LinkTarget {
  type: LinkTargetType;
  uuid: string;
  onDelete: LinkDeleteAction;
}

export type WidgetLink = Partial<Record<LinkTargetType, LinkTarget>>;

export interface TemplateSnapshot {
  name: string;
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  sessions: Record<string, Session>;
  links: Record<string, WidgetLink>;
}
