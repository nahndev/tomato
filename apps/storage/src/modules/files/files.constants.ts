import type { Prisma } from '../../generated/prisma/client';

export const FILE_UPLOAD_FIELD = 'file';
export const FILE_DOWNLOAD_DISPOSITION = 'attachment';

export const FILE_OMIT = { objectId: true } satisfies Prisma.FileOmit;
