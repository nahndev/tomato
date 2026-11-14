import type { Prisma } from '../../generated/prisma/client';

export const FILE_UPLOAD_FIELD = 'file';
export const FILE_DOWNLOAD_DISPOSITION = 'attachment';

export const FILE_OMIT = { objectId: true } satisfies Prisma.FileOmit;

export const FILES_MAX_IDS = 100;
export const FILE_METADATA_CACHE_CONTROL = 'private, no-cache';
export const FILE_CONTENT_CACHE_CONTROL = 'private, max-age=31536000, immutable';
