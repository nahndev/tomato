import { Injectable } from '@nestjs/common';
import type { GroupType } from '@tomato/constants';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { Group as GroupEntity } from '../../generated/prisma/client';
import { ROOT_FOLDER_NAME } from '../folders/folders.constants';

@Injectable()
export class GroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: { type?: GroupType; uuid?: string },
    skip: number,
    take: number,
  ): Promise<{ items: GroupEntity[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.group.findMany({ where, orderBy: { id: 'asc' }, skip, take }),
      this.prisma.group.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<GroupEntity | null> {
    return this.prisma.group.findUnique({ where: { id } });
  }

  /** Creates the group with its root folder; returns `null` when it already exists. */
  async create(data: { type: GroupType; uuid: string }): Promise<GroupEntity | null> {
    try {
      return await this.prisma.group.create({
        data: { ...data, folder: { create: { name: ROOT_FOLDER_NAME } } },
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.UNIQUE_VIOLATION)) return null;
      throw error;
    }
  }

  update(id: string, data: { type?: GroupType; uuid?: string }): Promise<GroupEntity> {
    return this.prisma.group.update({ where: { id }, data });
  }
}
