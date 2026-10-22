import { Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { Department as DepartmentEntity } from '../../generated/prisma/client';

@Injectable()
export class DepartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(skip: number, take: number): Promise<{ items: DepartmentEntity[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.department.findMany({ orderBy: { name: 'asc' }, skip, take }),
      this.prisma.department.count(),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<DepartmentEntity | null> {
    return this.prisma.department.findUnique({ where: { id } });
  }

  create(data: { name: string }): Promise<DepartmentEntity> {
    return this.prisma.department.create({ data });
  }

  async update(id: string, data: { name?: string }): Promise<DepartmentEntity | null> {
    try {
      return await this.prisma.department.update({ where: { id }, data });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.department.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return false;
      throw error;
    }
  }
}
