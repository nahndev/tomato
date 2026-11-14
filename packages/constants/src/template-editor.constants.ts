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
  SUBMIT_BUTTON: 'submit-button',
  IMAGE_UPLOADER: 'image-uploader',
  FILE_UPLOADER: 'file-uploader',
  BOARD: 'board',
  BREAK: 'break',
  SESSION: 'session',
  USERS: 'users',
  CREATED_AT: 'created-at',
  TEMPLATE: 'template',
  SUBMITTED_BY: 'submitted-by',
  CANVAS: 'canvas',
  MIXED_VIEW: 'mixed-view',
  REPEAT_VIEW: 'repeat-view',
  REFER_SUBMISSION: 'refer-submission',
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

export const SessionNestedType = {
  WIDGET: 'widget',
} as const;
export type SessionNestedType = (typeof SessionNestedType)[keyof typeof SessionNestedType];

export const LinkTargetType = {
  WIDGET: 'widget',
  TEMPLATE: 'template',
} as const;
export type LinkTargetType = (typeof LinkTargetType)[keyof typeof LinkTargetType];

export const LinkDeleteAction = {
  CASCADE: 'cascade',
  NONE: 'none',
} as const;
export type LinkDeleteAction = (typeof LinkDeleteAction)[keyof typeof LinkDeleteAction];

export const WidgetBehaviorType = {
  REFER_SUBMISSION: 'refer-submission',
} as const;
export type WidgetBehaviorType = (typeof WidgetBehaviorType)[keyof typeof WidgetBehaviorType];

export const ButtonActionType = {
  LINK: 'link',
  MAIL: 'mail',
} as const;
export type ButtonActionType = (typeof ButtonActionType)[keyof typeof ButtonActionType];

export const ButtonConditionType = {
  REQUIRED_FILLED: 'required-filled',
} as const;
export type ButtonConditionType = (typeof ButtonConditionType)[keyof typeof ButtonConditionType];

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
  LINKS: 'links',
  BEHAVIORS: 'behaviors',
} as const;
export type TemplateDocKey = (typeof TemplateDocKey)[keyof typeof TemplateDocKey];

export const TemplateDocMetaKey = {
  READY: 'ready',
} as const;
export type TemplateDocMetaKey = (typeof TemplateDocMetaKey)[keyof typeof TemplateDocMetaKey];

export const TEMPLATE_DOCUMENT_PREFIX = 'template';
