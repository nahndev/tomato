import { Injectable } from '@nestjs/common';
import type { MapValue } from './maps.types';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { Prisma } from '../../generated/prisma/client';
import type { MapEntity } from './maps.types';

@Injectable()
export class MapsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(skip: number, take: number): Promise<{ items: MapEntity[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.map.findMany({ orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }], skip, take }),
      this.prisma.map.count(),
    ]);
    return { items: items as unknown as MapEntity[], total };
  }

  async findById(id: string): Promise<MapEntity | null> {
    const entity = await this.prisma.map.findUnique({ where: { id } });
    return entity as unknown as MapEntity | null;
  }

  async create(data: { name: string; value: MapValue }): Promise<MapEntity> {
    const entity = await this.prisma.map.create({ data: { name: data.name, value: toJson(data.value) } });
    return entity as unknown as MapEntity;
  }

  async update(id: string, data: { name?: string; value?: MapValue }): Promise<MapEntity | null> {
    try {
      const entity = await this.prisma.map.update({
        where: { id },
        data: { name: data.name, value: data.value && toJson(data.value) },
      });
      return entity as unknown as MapEntity;
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const { count } = await this.prisma.map.deleteMany({ where: { id } });
    return count > 0;
  }
}

function toJson(value: MapValue): Prisma.InputJsonObject {
  return value as unknown as Prisma.InputJsonObject;
}
