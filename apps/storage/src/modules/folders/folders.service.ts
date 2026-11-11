import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { FolderTreeRepository } from '../folder-tree/folder-tree.repository';
import type { CreateFolderDto } from './dto/create-folder.dto';
import type { UpdateFolderDto } from './dto/update-folder.dto';
import type { Folder } from '../../generated/prisma/client';
import { FoldersRepository } from './folders.repository';
import type { FolderDetailEntity, FolderTree } from './folders.types';

@Injectable()
export class FoldersService {
  constructor(
    private readonly repository: FoldersRepository,
    private readonly folderTree: FolderTreeRepository,
    private readonly filesService: FilesService,
  ) {}

  async get(id: string): Promise<FolderDetailEntity> {
    const entity = await this.repository.findDetailById(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async getTree(id: string): Promise<FolderTree> {
    const folderIds = await this.folderTree.findSubtreeIds(id);
    if (folderIds.length === 0) throw new NotFoundException();
    const [folders, files] = await Promise.all([
      this.repository.findByIds(folderIds),
      this.filesService.listByFolderIds(folderIds),
    ]);
    return { folders, files };
  }

  async create(dto: CreateFolderDto): Promise<Folder> {
    const entity = await this.repository.create({ parentId: dto.parentId, name: dto.name });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async update(id: string, { name, parentId }: UpdateFolderDto): Promise<Folder> {
    await this.getNonRoot(id);
    const entity = parentId
      ? await this.repository.withMoveLock(async () => {
          await this.assertCanMove(id, parentId);
          return this.repository.update(id, { name, parentId });
        })
      : await this.repository.update(id, { name });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async remove(id: string): Promise<void> {
    await this.getNonRoot(id);
    const folderIds = await this.folderTree.findSubtreeIds(id);
    const objectIds = await this.filesService.findObjectIds(folderIds);
    if (!(await this.repository.delete(id))) throw new NotFoundException();
    await this.filesService.removeContents(objectIds);
  }

  private async getNonRoot(id: string) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    if (!entity.parentId) throw new ConflictException();
    return entity;
  }

  private async assertCanMove(id: string, targetId: string): Promise<void> {
    const [sourcePath, targetPath] = await Promise.all([
      this.folderTree.findPathToRoot(id),
      this.folderTree.findPathToRoot(targetId),
    ]);
    if (targetPath.length === 0) throw new NotFoundException();
    const isSameGroup = sourcePath.at(-1) === targetPath.at(-1);
    if (!isSameGroup || targetPath.includes(id)) throw new ConflictException();
  }
}
