import { Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { Document as DocumentEntity } from '../../generated/prisma/client';

@Injectable()
export class DocumentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    departmentId: string,
    skip: number,
    take: number,
  ): Promise<{ items: DocumentEntity[]; total: number }> {
    const where = { departmentId };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.document.findMany({ where, orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }], skip, take }),
      this.prisma.document.count({ where }),
    ]);
    return { items, total };
  }

  findById(departmentId: string, id: string): Promise<DocumentEntity | null> {
    return this.prisma.document.findFirst({ where: { id, departmentId } });
  }

  create(
    departmentId: string,
    data: { title: string; content?: string; ownerId: string },
  ): Promise<DocumentEntity> {
    return this.prisma.document.create({ data: { ...data, departmentId } });
  }

  async update(
    departmentId: string,
    id: string,
    data: { title?: string; content?: string },
  ): Promise<DocumentEntity | null> {
    try {
      return await this.prisma.document.update({ where: { id, departmentId }, data });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(departmentId: string, id: string): Promise<boolean> {
    const { count } = await this.prisma.document.deleteMany({ where: { id, departmentId } });
    return count > 0;
  }
}
