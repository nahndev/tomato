import { Injectable } from '@nestjs/common';
import type { GroupType } from '@tomato/constants';
import { PrismaService } from '../../common';
import type { Group as GroupEntity } from '../../generated/prisma/client';
import { ROOT_FOLDER_NAME } from '../folders/folders.constants';
import type { GroupWithRootFolder } from './groups.types';

@Injectable()
export class GroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: { type?: GroupType; uuid?: string },
    skip: number,
    take: number,
  ): Promise<{ items: GroupWithRootFolder[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.group.findMany({ where, include: { folder: true }, orderBy: { id: 'asc' }, skip, take }),
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
