import { AvatarMimeType } from '@tomato/constants';
import type { Prisma } from '../../generated/prisma/client';

export const EMAIL_MAX_LENGTH = 254;
export const AVATAR_DIRECTORY = 'avatars';

export const AvatarExtension = {
  [AvatarMimeType.PNG]: 'png',
  [AvatarMimeType.JPEG]: 'jpg',
  [AvatarMimeType.WEBP]: 'webp',
} as const;
export type AvatarExtension = (typeof AvatarExtension)[AvatarMimeType];

export const USER_INCLUDE = {
  addresses: { orderBy: { position: 'asc' } },
  roles: { select: { roleId: true } },
} satisfies Prisma.UserInclude;
