import { Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { UnitType as UnitTypeModel } from '../../generated/prisma/client';

export type UnitTypeDeleteResult = 'deleted' | 'not-found' | 'in-use';

@Injectable()
export class UnitTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<UnitTypeModel[]> {
    return this.prisma.unitType.findMany({ orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] });
  }

  findById(id: string): Promise<UnitTypeModel | null> {
    return this.prisma.unitType.findUnique({ where: { id } });
  }

  create(name: string): Promise<UnitTypeModel> {
    return this.prisma.unitType.create({ data: { name } });
  }

  async update(id: string, name: string): Promise<UnitTypeModel | null> {
    try {
      return await this.prisma.unitType.update({ where: { id }, data: { name } });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<UnitTypeDeleteResult> {
    try {
      await this.prisma.unitType.delete({ where: { id } });
      return 'deleted';
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return 'not-found';
      if (isPrismaError(error, PrismaErrorCode.FOREIGN_KEY_VIOLATION)) return 'in-use';
      throw error;
    }
  }
}
