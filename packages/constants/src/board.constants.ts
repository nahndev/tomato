export const ValueType = {
  DEFAULT: 'default',
  DATE: 'date',
  TIME: 'time',
} as const;
export type ValueType = (typeof ValueType)[keyof typeof ValueType];

export const DisplayType = {
  TEXT: 'text',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
  NUMBER: 'number',
} as const;
export type DisplayType = (typeof DisplayType)[keyof typeof DisplayType];

export const DisplayBucket = {
  ENTITY: 'entity',
  DATE: 'date',
  TEXT: 'text',
} as const;
export type DisplayBucket = (typeof DisplayBucket)[keyof typeof DisplayBucket];

export const BoardView = {
  TABLE: 'table',
  TASK: 'task',
  AGENDA: 'agenda',
} as const;
export type BoardView = (typeof BoardView)[keyof typeof BoardView];

export const TaskConditionOperation = {
  IS: 'is',
  IS_NOT: 'is-not',
} as const;
export type TaskConditionOperation = (typeof TaskConditionOperation)[keyof typeof TaskConditionOperation];
