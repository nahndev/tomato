export const AvatarMimeType = {
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  WEBP: 'image/webp',
} as const;
export type AvatarMimeType = (typeof AvatarMimeType)[keyof typeof AvatarMimeType];

export const AVATAR_MAX_SIZE = 5 * 1024 * 1024;
export const USER_EID_MAX_LENGTH = 50;
export const USER_TEL_PATTERN = /^\+?[0-9][0-9 ()-]{2,31}$/;
export const USER_ADDRESS_MAX_COUNT = 10;
export const USER_ADDRESS_FIELD_MAX_LENGTH = 200;
export const USER_POSTAL_CODE_MAX_LENGTH = 20;
