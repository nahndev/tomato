import { Injectable } from '@nestjs/common';
import type { MapValue } from '@tomato/types';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { DepartmentMap as DepartmentMapEntity, Prisma } from '../../generated/prisma/client';

@Injectable()
export class MapsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    departmentId: string,
    skip: number,
    take: number,
  ): Promise<{ items: DepartmentMapEntity[]; total: number }> {
    const where = { departmentId };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.departmentMap.findMany({ where, orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }], skip, take }),
      this.prisma.departmentMap.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<DepartmentMapEntity | null> {
    return this.prisma.departmentMap.findUnique({ where: { id } });
  }

  create(departmentId: string, data: { name: string; value: MapValue }): Promise<DepartmentMapEntity> {
    return this.prisma.departmentMap.create({
      data: { departmentId, name: data.name, value: toJson(data.value) },
    });
  }

  async update(id: string, data: { name?: string; value?: MapValue }): Promise<DepartmentMapEntity | null> {
    try {
      return await this.prisma.departmentMap.update({
        where: { id },
        data: { name: data.name, value: data.value && toJson(data.value) },
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const { count } = await this.prisma.departmentMap.deleteMany({ where: { id } });
    return count > 0;
  }
}

function toJson(value: MapValue): Prisma.InputJsonObject {
  return value as unknown as Prisma.InputJsonObject;
}
