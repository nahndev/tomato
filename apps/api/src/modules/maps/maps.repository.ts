import { Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type {
  DepartmentMap as DepartmentMapEntity,
  MapPin as MapPinEntity,
} from '../../generated/prisma/client';
import type { MapPinData } from './maps.types';

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

  findById(id: string): Promise<(DepartmentMapEntity & { pins: MapPinEntity[] }) | null> {
    return this.prisma.departmentMap.findUnique({
      where: { id },
      include: { pins: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] } },
    });
  }

  create(departmentId: string, data: { name: string }): Promise<DepartmentMapEntity> {
    return this.prisma.departmentMap.create({ data: { ...data, departmentId } });
  }

  async update(id: string, data: { name?: string; imageFileId?: string }): Promise<DepartmentMapEntity | null> {
    try {
      return await this.prisma.departmentMap.update({ where: { id }, data });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const { count } = await this.prisma.departmentMap.deleteMany({ where: { id } });
    return count > 0;
  }

  async createPin(mapId: string, data: MapPinData): Promise<MapPinEntity | null> {
    try {
      return await this.prisma.mapPin.create({ data: { ...data, mapId } });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.FOREIGN_KEY_VIOLATION)) return null;
      throw error;
    }
  }

  async updatePin(mapId: string, id: string, data: Partial<MapPinData>): Promise<MapPinEntity | null> {
    try {
      return await this.prisma.mapPin.update({ where: { id, mapId }, data });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async deletePin(mapId: string, id: string): Promise<boolean> {
    const { count } = await this.prisma.mapPin.deleteMany({ where: { id, mapId } });
    return count > 0;
  }
}
