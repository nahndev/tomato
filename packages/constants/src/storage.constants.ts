export const GroupType = {
  USER: 'user',
  DEPARTMENT: 'department',
} as const;
export type GroupType = (typeof GroupType)[keyof typeof GroupType];

export const STORAGE_FILE_MAX_SIZE = 20 * 1024 * 1024;
