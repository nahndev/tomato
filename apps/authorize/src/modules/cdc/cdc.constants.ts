export const CdcTable = {
  USERS: 'users',
  DOCUMENTS: 'documents',
} as const;
export type CdcTable = (typeof CdcTable)[keyof typeof CdcTable];

export const CdcOperation = {
  CREATE: 'c',
  READ: 'r',
} as const;
export type CdcOperation = (typeof CdcOperation)[keyof typeof CdcOperation];
