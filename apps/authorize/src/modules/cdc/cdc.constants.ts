export const CDC_TOPIC_PREFIX = 'tomato.public';

export const CdcTable = {
  USERS: 'users',
  ROLES: 'roles',
  DOCUMENTS: 'documents',
  ROLE_PERMISSIONS: 'role_permissions',
} as const;
export type CdcTable = (typeof CdcTable)[keyof typeof CdcTable];

export const CDC_TOPICS = Object.values(CdcTable).map((table) => `${CDC_TOPIC_PREFIX}.${table}`);

export const CdcOperation = {
  CREATE: 'c',
  READ: 'r',
  UPDATE: 'u',
  DELETE: 'd',
} as const;
export type CdcOperation = (typeof CdcOperation)[keyof typeof CdcOperation];
