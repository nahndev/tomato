import { Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { Folder as FolderEntity } from '../../generated/prisma/client';
import { FOLDER_MOVE_LOCK_KEY } from './folders.constants';

@Injectable()
export class FoldersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<FolderEntity | null> {
    return this.prisma.folder.findUnique({ where: { id } });
  }

  findChildren(parentId: string): Promise<FolderEntity[]> {
    return this.prisma.folder.findMany({ where: { parentId }, orderBy: { id: 'asc' } });
  }

  findByIds(ids: string[]): Promise<FolderEntity[]> {
    return this.prisma.folder.findMany({ where: { id: { in: ids } }, orderBy: { id: 'asc' } });
  }

  async create(data: { parentId: string; name: string }): Promise<FolderEntity | null> {
    try {
      return await this.prisma.folder.create({ data });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.FOREIGN_KEY_VIOLATION)) return null;
      throw error;
    }
  }

  async update(id: string, data: { name?: string; parentId?: string }): Promise<FolderEntity | null> {
    try {
      return await this.prisma.folder.update({ where: { id }, data });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const { count } = await this.prisma.folder.deleteMany({ where: { id } });
    return count > 0;
  }

  /** Serializes moves: two concurrent ones could otherwise form a cycle. */
  withMoveLock<T>(action: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.$executeRaw`SELECT pg_advisory_xact_lock(${FOLDER_MOVE_LOCK_KEY}::bigint)`;
      return action();
    });
  }
}
