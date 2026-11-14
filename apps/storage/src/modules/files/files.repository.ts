import { Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { File, Prisma } from '../../generated/prisma/client';
import { FILE_OMIT } from './files.constants';
import type { FileEntity } from './files.types';

@Injectable()
export class FilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<FileEntity | null> {
    return this.prisma.file.findUnique({ where: { id }, omit: FILE_OMIT });
  }

  findByIds(ids: string[]): Promise<FileEntity[]> {
    return this.prisma.file.findMany({ where: { id: { in: ids } }, orderBy: { id: 'asc' }, omit: FILE_OMIT });
  }

  findStoredById(id: string): Promise<File | null> {
    return this.prisma.file.findUnique({ where: { id } });
  }

  findByFolderIds(folderIds: string[]): Promise<FileEntity[]> {
    return this.prisma.file.findMany({
      where: { folderId: { in: folderIds } },
      orderBy: { id: 'asc' },
      omit: FILE_OMIT,
    });
  }

  async findObjectIds(folderIds: string[]): Promise<string[]> {
    const rows = await this.prisma.file.findMany({
      where: { folderId: { in: folderIds } },
      select: { objectId: true },
    });
    return rows.map(({ objectId }) => objectId);
  }

  async create(data: Prisma.FileUncheckedCreateInput): Promise<FileEntity | null> {
    try {
      return await this.prisma.file.create({ data, omit: FILE_OMIT });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.FOREIGN_KEY_VIOLATION)) return null;
      throw error;
    }
  }

  async update(id: string, data: { name?: string; folderId?: string }): Promise<FileEntity | null> {
    try {
      return await this.prisma.file.update({ where: { id }, data, omit: FILE_OMIT });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<File | null> {
    try {
      return await this.prisma.file.delete({ where: { id } });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }
}
