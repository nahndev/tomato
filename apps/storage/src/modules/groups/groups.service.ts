import { Injectable } from '@nestjs/common';
import type { GroupType } from '@tomato/constants';
import type { PaginatedResponse } from '../../common';
import type { ListGroupsQueryDto } from './dto/list-groups-query.dto';
import { GroupsRepository } from './groups.repository';
import type { GroupWithRootFolder } from './groups.types';

@Injectable()
export class GroupsService {
  constructor(private readonly repository: GroupsRepository) {}

  async list({ limit, page, pageSize }: ListGroupsQueryDto): Promise<PaginatedResponse<GroupWithRootFolder>> {
    const { items, total } = await this.repository.findMany(limit ?? {}, (page - 1) * pageSize, pageSize);
    return { items, total, page, pageSize };
  }

  /** Idempotent: CDC events can be replayed. */
  async upsert(data: { type: GroupType; uuid: string; label: string }): Promise<void> {
    await this.repository.upsert(data);
  }
}
