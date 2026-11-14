export const GroupType = {
  USER: 'user',
  DEPARTMENT: 'department',
} as const;
export type GroupType = (typeof GroupType)[keyof typeof GroupType];

export const STORAGE_FILE_MAX_SIZE = 20 * 1024 * 1024;

export const ImageMimeType = {
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  WEBP: 'image/webp',
} as const;
export type ImageMimeType = (typeof ImageMimeType)[keyof typeof ImageMimeType];

export const ImageVariant = {
  SMALL: 'small',
  MEDIUM: 'medium',
} as const;
export type ImageVariant = (typeof ImageVariant)[keyof typeof ImageVariant];
