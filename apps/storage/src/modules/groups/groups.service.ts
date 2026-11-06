import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { GroupType } from '@tomato/constants';
import type { PaginatedResponse, StorageGroup, StorageGroupDetail } from '@tomato/types';
import { PrismaErrorCode, isPrismaError } from '../../common';
import { FoldersService } from '../folders/folders.service';
import type { CreateGroupDto } from './dto/create-group.dto';
import type { ListGroupsQueryDto } from './dto/list-groups-query.dto';
import type { UpdateGroupDto } from './dto/update-group.dto';
import { toStorageGroup } from './groups.mapper';
import { GroupsRepository } from './groups.repository';

@Injectable()
export class GroupsService {
  constructor(
    private readonly repository: GroupsRepository,
    private readonly foldersService: FoldersService,
  ) {}

  async list({ type, uuid, page, pageSize }: ListGroupsQueryDto): Promise<PaginatedResponse<StorageGroup>> {
    const { items, total } = await this.repository.findMany({ type, uuid }, (page - 1) * pageSize, pageSize);
    return { items: items.map(toStorageGroup), total, page, pageSize };
  }

  async get(id: string): Promise<StorageGroupDetail> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return { ...toStorageGroup(entity), ...(await this.foldersService.getTree(entity.folderId)) };
  }

  async create(dto: CreateGroupDto): Promise<StorageGroup> {
    const entity = await this.repository.create({ type: dto.type, uuid: dto.uuid });
    if (!entity) throw new ConflictException();
    return toStorageGroup(entity);
  }

  /** Idempotent: CDC events can be replayed. */
  async seed(type: GroupType, uuid: string): Promise<void> {
    await this.repository.create({ type, uuid });
  }

  async update(id: string, dto: UpdateGroupDto): Promise<StorageGroup> {
    try {
      return toStorageGroup(await this.repository.update(id, { type: dto.type, uuid: dto.uuid }));
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) throw new NotFoundException();
      if (isPrismaError(error, PrismaErrorCode.UNIQUE_VIOLATION)) throw new ConflictException();
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    await this.foldersService.removeTree(entity.folderId);
  }
}
