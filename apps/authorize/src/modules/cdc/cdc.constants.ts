export const CDC_TOPIC_PREFIX = 'tomato.public';

export const CdcTable = {
  USERS: 'users',
  DOCUMENTS: 'documents',
} as const;
export type CdcTable = (typeof CdcTable)[keyof typeof CdcTable];

export const CDC_TOPICS = Object.values(CdcTable).map((table) => `${CDC_TOPIC_PREFIX}.${table}`);

export const CdcOperation = {
  CREATE: 'c',
  READ: 'r',
} as const;
export type CdcOperation = (typeof CdcOperation)[keyof typeof CdcOperation];
