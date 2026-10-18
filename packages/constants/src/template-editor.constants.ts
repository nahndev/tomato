export const WidgetType = {
  TEXT: 'text',
  TEXT_AREA: 'text-area',
  NUMBER: 'number',
  DATE: 'date',
  DATETIME: 'datetime',
  TIME: 'time',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  LABEL: 'label',
  SIGNATURE: 'signature',
  BUTTON: 'button',
  IMAGE_UPLOADER: 'image-uploader',
  FILE_UPLOADER: 'file-uploader',
  BOARD: 'board',
  BREAK: 'break',
  SESSION: 'session',
  USERS: 'users',
  CREATED_AT: 'created-at',
  TEMPLATE: 'template',
  SUBMITTED_BY: 'submitted-by',
  API_CALL: 'api-call',
} as const;
export type WidgetType = (typeof WidgetType)[keyof typeof WidgetType];

export const WidgetGroup = {
  COMMON: 'common',
  MEDIA: 'media',
  ADVANCE: 'advance',
  SYSTEM: 'system',
  DEFAULT: 'default',
} as const;
export type WidgetGroup = (typeof WidgetGroup)[keyof typeof WidgetGroup];

export const SessionConditionType = {
  ALWAYS: 'always',
  BUTTON_CLICKED: 'button-clicked',
  WIDGET_HAS_VALUE: 'widget-has-value',
} as const;
export type SessionConditionType = (typeof SessionConditionType)[keyof typeof SessionConditionType];

export const ApiCallMethod = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  PUT: 'PUT',
} as const;
export type ApiCallMethod = (typeof ApiCallMethod)[keyof typeof ApiCallMethod];

export const ApiCallValueSource = {
  STATIC: 'static',
  WIDGET: 'widget',
} as const;
export type ApiCallValueSource = (typeof ApiCallValueSource)[keyof typeof ApiCallValueSource];

export const ApiCallResponseType = {
  JSON: 'json',
  IMAGE: 'image',
} as const;
export type ApiCallResponseType = (typeof ApiCallResponseType)[keyof typeof ApiCallResponseType];

export const ButtonActionType = {
  LINK: 'link',
  MAIL: 'mail',
} as const;
export type ButtonActionType = (typeof ButtonActionType)[keyof typeof ButtonActionType];

export const RecipientType = {
  MAIL: 'mail',
  USER: 'user',
} as const;
export type RecipientType = (typeof RecipientType)[keyof typeof RecipientType];

export const TemplateDocKey = {
  NAME: 'name',
  META: 'meta',
  WIDGETS: 'widgets',
  SESSIONS: 'sessions',
  LAYOUTS: 'layouts',
  WIDGET_TO_SESSION: 'widgetToSession',
} as const;
export type TemplateDocKey = (typeof TemplateDocKey)[keyof typeof TemplateDocKey];

export const TemplateDocMetaKey = {
  READY: 'ready',
} as const;
export type TemplateDocMetaKey = (typeof TemplateDocMetaKey)[keyof typeof TemplateDocMetaKey];

export const TEMPLATE_DOCUMENT_PREFIX = 'template';
