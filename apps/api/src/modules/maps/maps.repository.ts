import { Injectable } from '@nestjs/common';
import type { MapValue } from './maps.types';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { Prisma } from '../../generated/prisma/client';
import type { DepartmentMapEntity } from './maps.types';

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
    return { items: items as unknown as DepartmentMapEntity[], total };
  }

  async findById(id: string): Promise<DepartmentMapEntity | null> {
    const entity = await this.prisma.departmentMap.findUnique({ where: { id } });
    return entity as unknown as DepartmentMapEntity | null;
  }

  async create(departmentId: string, data: { name: string; value: MapValue }): Promise<DepartmentMapEntity> {
    const entity = await this.prisma.departmentMap.create({
      data: { departmentId, name: data.name, value: toJson(data.value) },
    });
    return entity as unknown as DepartmentMapEntity;
  }

  async update(id: string, data: { name?: string; value?: MapValue }): Promise<DepartmentMapEntity | null> {
    try {
      const entity = await this.prisma.departmentMap.update({
        where: { id },
        data: { name: data.name, value: data.value && toJson(data.value) },
      });
      return entity as unknown as DepartmentMapEntity;
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
