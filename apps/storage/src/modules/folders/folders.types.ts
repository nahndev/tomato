import type { Folder, Prisma } from '../../generated/prisma/client';
import type { FileEntity } from '../files/files.types';
import type { FOLDER_DETAIL_INCLUDE } from './folders.constants';

export type FolderDetailEntity = Prisma.FolderGetPayload<{ include: typeof FOLDER_DETAIL_INCLUDE }>;

export interface FolderTree {
  folders: Folder[];
  files: FileEntity[];
}
