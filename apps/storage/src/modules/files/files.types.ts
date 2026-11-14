import type { Prisma } from '../../generated/prisma/client';
import type { FILE_OMIT } from './files.constants';

export type FileEntity = Prisma.FileGetPayload<{ omit: typeof FILE_OMIT }>;

export interface UploadedStorageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface FileContent {
  content: Buffer;
  name: string;
  mimeType: string;
  isFinal: boolean;
}
