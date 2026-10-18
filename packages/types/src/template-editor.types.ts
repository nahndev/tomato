import type {
  ApiCallMethod,
  ApiCallResponseType,
  ApiCallValueSource,
  ButtonActionType,
  RecipientType,
  SessionConditionType,
  WidgetType,
} from '@tomato/constants';

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

export interface ApiCallKeyValue {
  id: string;
  key: string;
  source: ApiCallValueSource;
  value?: string;
  widgetId?: string;
}

export interface ApiCallJsonMapping {
  id: string;
  key: string;
  widgetId?: string;
}

export interface ApiCallResponseConfig {
  type: ApiCallResponseType;
  show?: boolean;
  imageWidgetId?: string;
  jsonMappings?: ApiCallJsonMapping[];
}

export interface ApiCallConfig {
  hostId?: string;
  method: ApiCallMethod;
  url: string;
  params: ApiCallKeyValue[];
  headers: ApiCallKeyValue[];
  payload?: string;
  response: ApiCallResponseConfig;
}

export interface WidgetProperties {
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: OptionItem[];
  content?: RichTextState;
  url?: string;
  actions?: ButtonAction[];
  apiCall?: ApiCallConfig;
  compact?: boolean;
  textStyle?: StyleProperties;
  containerStyle?: StyleProperties;
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

export type SessionCondition = AlwaysCondition | ButtonClickedCondition | WidgetHasValueCondition;

export interface SessionProperties {
  name: string;
  icon?: string;
  description?: RichTextState;
  condition?: SessionCondition;
}

export interface Session extends SessionProperties {
  id: string;
}

export interface TemplateSnapshot {
  name: string;
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  sessions: Record<string, Session>;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  version: string;
  snapshot: TemplateSnapshot;
  createdAt: string;
}
