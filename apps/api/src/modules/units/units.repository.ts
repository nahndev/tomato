import { Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { Prisma } from '../../generated/prisma/client';

const UNIT_INCLUDE = { type: true } satisfies Prisma.UnitInclude;

export type UnitEntity = Prisma.UnitGetPayload<{ include: typeof UNIT_INCLUDE }>;

export interface UnitWriteData {
  name?: string;
  typeId?: string;
}

export type UnitWriteResult = { entity: UnitEntity } | { error: 'not-found' | 'unknown-type' };

@Injectable()
export class UnitsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(skip: number, take: number): Promise<{ items: UnitEntity[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.unit.findMany({
        orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
        skip,
        take,
        include: UNIT_INCLUDE,
      }),
      this.prisma.unit.count(),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<UnitEntity | null> {
    return this.prisma.unit.findUnique({ where: { id }, include: UNIT_INCLUDE });
  }

  findSystem(): Promise<UnitEntity | null> {
    return this.prisma.unit.findFirst({ where: { isSystem: true }, include: UNIT_INCLUDE });
  }

  async create(data: { name: string; typeId: string }): Promise<UnitWriteResult> {
    return this.write(() => this.prisma.unit.create({ data, include: UNIT_INCLUDE }));
  }

  async update(id: string, data: UnitWriteData): Promise<UnitWriteResult> {
    return this.write(() => this.prisma.unit.update({ where: { id }, data, include: UNIT_INCLUDE }));
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.unit.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return false;
      throw error;
    }
  }

  private async write(run: () => Promise<UnitEntity>): Promise<UnitWriteResult> {
    try {
      return { entity: await run() };
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return { error: 'not-found' };
      if (isPrismaError(error, PrismaErrorCode.FOREIGN_KEY_VIOLATION)) return { error: 'unknown-type' };
      throw error;
    }
  }
}
