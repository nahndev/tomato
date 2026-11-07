export const CDC_TOPICS = ['tomato.public.users', 'tomato.public.departments'];

export const CdcOperation = {
  CREATE: 'c',
  READ: 'r',
  UPDATE: 'u',
} as const;
export type CdcOperation = (typeof CdcOperation)[keyof typeof CdcOperation];
