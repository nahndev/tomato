import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../../common';
import { FolderTreeRepository } from '../folder-tree/folder-tree.repository';
import type { UpdateFileDto } from './dto/update-file.dto';
import { FilesRepository } from './files.repository';
import { FilesStorage } from './files.storage';
import type { FileEntity, UploadedStorageFile } from './files.types';

@Injectable()
export class FilesService {
  constructor(
    private readonly repository: FilesRepository,
    private readonly storage: FilesStorage,
    private readonly folderTree: FolderTreeRepository,
  ) {}

  async get(id: string): Promise<FileEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async getContent(id: string): Promise<{ content: Buffer; name: string; mimeType: string }> {
    const entity = await this.repository.findStoredById(id);
    const content = entity && (await this.storage.read(entity.objectId));
    if (!entity || !content) throw new NotFoundException();
    return { content, name: entity.name, mimeType: entity.mimeType };
  }

  listByFolderIds(folderIds: string[]): Promise<FileEntity[]> {
    return this.repository.findByFolderIds(folderIds);
  }

  async create(folderId: string, file?: UploadedStorageFile): Promise<FileEntity> {
    if (!file) throw new BadRequestException();
    const name = file.originalname.trim();
    if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) throw new BadRequestException();

    const objectId = await this.storage.save(file.buffer);
    try {
      const entity = await this.repository.create({
        folderId,
        name,
        mimeType: file.mimetype,
        size: file.size,
        objectId,
      });
      if (!entity) throw new NotFoundException();
      return entity;
    } catch (error) {
      await this.storage.remove([objectId]);
      throw error;
    }
  }

  async update(id: string, dto: UpdateFileDto): Promise<FileEntity> {
    if (dto.folderId) await this.assertSameGroup(id, dto.folderId);
    const entity = await this.repository.update(id, { name: dto.name, folderId: dto.folderId });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.repository.delete(id);
    if (!entity) throw new NotFoundException();
    await this.storage.remove([entity.objectId]);
  }

  /** Call after the folder is deleted. */
  removeContents(objectIds: string[]): Promise<void> {
    return this.storage.remove(objectIds);
  }

  findObjectIds(folderIds: string[]): Promise<string[]> {
    return this.repository.findObjectIds(folderIds);
  }

  private async assertSameGroup(id: string, targetFolderId: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    const [sourcePath, targetPath] = await Promise.all([
      this.folderTree.findPathToRoot(entity.folderId),
      this.folderTree.findPathToRoot(targetFolderId),
    ]);
    if (targetPath.length === 0) throw new NotFoundException();
    if (sourcePath.at(-1) !== targetPath.at(-1)) throw new ConflictException();
  }
}
