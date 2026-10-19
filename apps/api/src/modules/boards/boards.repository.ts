import { Injectable } from '@nestjs/common';
import type { BoardColumn } from '@tomato/types';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { Prisma } from '../../generated/prisma/client';

const BOARD_INCLUDE = {
  templates: {
    orderBy: { template: { createdAt: 'asc' } },
    include: { template: { include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } } } },
  },
} satisfies Prisma.BoardInclude;

export type BoardEntity = Prisma.BoardGetPayload<{ include: typeof BOARD_INCLUDE }>;

export type BoardListEntity = Prisma.BoardGetPayload<{ include: { _count: { select: { templates: true } } } }>;

export interface BoardWriteData {
  name?: string;
  columns?: BoardColumn[];
  templateIds?: string[];
}

function toJson(columns: BoardColumn[] | undefined): Prisma.InputJsonValue | undefined {
  return columns as unknown as Prisma.InputJsonValue | undefined;
}

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(skip: number, take: number): Promise<{ items: BoardListEntity[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.board.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { _count: { select: { templates: true } } },
      }),
      this.prisma.board.count(),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<BoardEntity | null> {
    return this.prisma.board.findUnique({ where: { id }, include: BOARD_INCLUDE });
  }

  countTemplates(ids: string[]): Promise<number> {
    return this.prisma.template.count({ where: { id: { in: ids } } });
  }

  create(data: BoardWriteData & { name: string }): Promise<BoardEntity> {
    const { name, columns, templateIds = [] } = data;
    return this.prisma.board.create({
      data: {
        name,
        columns: toJson(columns) ?? [],
        templates: { create: templateIds.map((templateId) => ({ templateId })) },
      },
      include: BOARD_INCLUDE,
    });
  }

  async update(id: string, data: BoardWriteData): Promise<BoardEntity | null> {
    const { name, columns, templateIds } = data;
    try {
      return await this.prisma.board.update({
        where: { id },
        data: {
          name,
          columns: toJson(columns),
          templates: templateIds && {
            deleteMany: {},
            create: templateIds.map((templateId) => ({ templateId })),
          },
        },
        include: BOARD_INCLUDE,
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.board.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return false;
      throw error;
    }
  }
}
