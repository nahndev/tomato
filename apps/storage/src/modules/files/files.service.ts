import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { ImageVariant } from '@tomato/constants';
import { EventBusService } from '@tomato/events';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../../common';
import { FolderTreeRepository } from '../folder-tree/folder-tree.repository';
import type { UpdateFileDto } from './dto/update-file.dto';
import { IMAGE_VARIANT_MIME_TYPE, SCALABLE_IMAGE_TYPES } from './files.constants';
import { ImageUploadedEvent } from './files.events';
import { FilesRepository } from './files.repository';
import { FilesStorage } from './files.storage';
import type { FileContent, FileEntity, UploadedStorageFile } from './files.types';
import { ImageVariantsService } from './image-variants.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly repository: FilesRepository,
    private readonly storage: FilesStorage,
    private readonly folderTree: FolderTreeRepository,
    private readonly imageVariants: ImageVariantsService,
    private readonly eventBus: EventBusService,
  ) {}

  async get(id: string): Promise<FileEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  list(ids: string[]): Promise<FileEntity[]> {
    return ids.length === 0 ? Promise.resolve([]) : this.repository.findByIds(ids);
  }

  async getContent(id: string, variant?: ImageVariant): Promise<FileContent> {
    const entity = await this.repository.findStoredById(id);
    if (!entity) throw new NotFoundException();
    const isScaled = variant !== undefined && SCALABLE_IMAGE_TYPES.includes(entity.mimeType);
    if (isScaled) {
      const scaled = await this.storage.read(entity.objectId, variant);
      if (scaled) return { content: scaled, name: entity.name, mimeType: IMAGE_VARIANT_MIME_TYPE, isFinal: true };
      void this.imageVariants.generate(entity.objectId);
    }
    const content = await this.storage.read(entity.objectId);
    if (!content) throw new NotFoundException();
    return { content, name: entity.name, mimeType: entity.mimeType, isFinal: !isScaled };
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
      if (SCALABLE_IMAGE_TYPES.includes(entity.mimeType)) this.eventBus.emit(new ImageUploadedEvent(objectId));
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
