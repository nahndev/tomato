import type { Folder as FolderEntity, Group as GroupEntity } from '../../generated/prisma/client';

export type GroupWithRootFolder = GroupEntity & { folder: FolderEntity };
