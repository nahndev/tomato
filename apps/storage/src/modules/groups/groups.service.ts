import { Injectable } from '@nestjs/common';
import type { GroupType } from '@tomato/constants';
import type { PaginatedResponse, StorageGroup } from '@tomato/types';
import type { ListGroupsQueryDto } from './dto/list-groups-query.dto';
import { toStorageGroup } from './groups.mapper';
import { GroupsRepository } from './groups.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly repository: GroupsRepository) {}

  async list({ limit, page, pageSize }: ListGroupsQueryDto): Promise<PaginatedResponse<StorageGroup>> {
    const { items, total } = await this.repository.findMany(limit ?? {}, (page - 1) * pageSize, pageSize);
    return { items: items.map(toStorageGroup), total, page, pageSize };
  }

  /** Idempotent: CDC events can be replayed. */
  async upsert(data: { type: GroupType; uuid: string; label: string }): Promise<void> {
    await this.repository.upsert(data);
  }
}
