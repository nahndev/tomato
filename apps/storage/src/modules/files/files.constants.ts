import { ImageMimeType, ImageVariant } from '@tomato/constants';
import type { Prisma } from '../../generated/prisma/client';

export const FILE_UPLOAD_FIELD = 'file';
export const FILE_DOWNLOAD_DISPOSITION = 'attachment';

export const FILE_OMIT = { objectId: true } satisfies Prisma.FileOmit;

export const FILES_MAX_IDS = 100;
export const FILE_REVALIDATE_CACHE_CONTROL = 'private, no-cache';
export const FILE_CONTENT_CACHE_CONTROL = 'private, max-age=31536000, immutable';

export const SCALABLE_IMAGE_TYPES: readonly string[] = Object.values(ImageMimeType);
export const IMAGE_VARIANT_MIME_TYPE = 'image/webp';
export const IMAGE_VARIANT_SIZES: Record<ImageVariant, number> = {
  [ImageVariant.SMALL]: 128,
  [ImageVariant.MEDIUM]: 512,
};
