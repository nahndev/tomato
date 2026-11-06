import { Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { File as FileEntity } from '../../generated/prisma/client';

@Injectable()
export class FilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<FileEntity | null> {
    return this.prisma.file.findUnique({ where: { id } });
  }

  findByFolderIds(folderIds: string[]): Promise<FileEntity[]> {
    return this.prisma.file.findMany({ where: { folderId: { in: folderIds } }, orderBy: { id: 'asc' } });
  }

  async findObjectIds(folderIds: string[]): Promise<string[]> {
    const rows = await this.prisma.file.findMany({
      where: { folderId: { in: folderIds } },
      select: { objectId: true },
    });
    return rows.map(({ objectId }) => objectId);
  }

  /** Returns `null` when the folder does not exist. */
  async create(data: {
    folderId: string;
    name: string;
    mimeType: string;
    size: number;
    objectId: string;
  }): Promise<FileEntity | null> {
    try {
      return await this.prisma.file.create({ data });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.FOREIGN_KEY_VIOLATION)) return null;
      throw error;
    }
  }

  async update(id: string, data: { name?: string; folderId?: string }): Promise<FileEntity | null> {
    try {
      return await this.prisma.file.update({ where: { id }, data });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<FileEntity | null> {
    try {
      return await this.prisma.file.delete({ where: { id } });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }
}
