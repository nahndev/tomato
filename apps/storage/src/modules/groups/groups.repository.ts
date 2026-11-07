import { Injectable } from '@nestjs/common';
import type { GroupType } from '@tomato/constants';
import { PrismaService } from '../../common';
import type { Group as GroupEntity, Prisma } from '../../generated/prisma/client';
import { ROOT_FOLDER_NAME } from '../folders/folders.constants';
import type { GroupWithRootFolder } from './groups.types';

// `user` sorts after `department`, so a user's own group opens first.
const GROUP_ORDER = [{ type: 'desc' }, { id: 'asc' }] satisfies Prisma.GroupOrderByWithRelationInput[];

@Injectable()
export class GroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: Prisma.GroupWhereInput,
    skip: number,
    take: number,
  ): Promise<{ items: GroupWithRootFolder[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.group.findMany({ where, include: { folder: true }, orderBy: GROUP_ORDER, skip, take }),
      this.prisma.group.count({ where }),
    ]);
    return { items, total };
  }

  upsert({ type, uuid, label }: { type: GroupType; uuid: string; label: string }): Promise<GroupEntity> {
    return this.prisma.group.upsert({
      where: { type_uuid: { type, uuid } },
      create: { type, uuid, label, folder: { create: { name: ROOT_FOLDER_NAME } } },
      update: { label },
    });
  }
}
