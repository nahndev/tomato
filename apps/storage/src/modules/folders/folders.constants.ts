import type { Prisma } from '../../generated/prisma/client';
import { FILE_OMIT } from '../files/files.constants';

export const ROOT_FOLDER_NAME = 'root';
// Arbitrary, unique per purpose in this database.
export const FOLDER_MOVE_LOCK_KEY = 7001;

export const FOLDER_DETAIL_INCLUDE = {
  children: { orderBy: { id: 'asc' } },
  files: { orderBy: { id: 'asc' }, omit: FILE_OMIT },
} satisfies Prisma.FolderInclude;
