import { Injectable } from "@nestjs/common";
import type { BoardColumn } from "./boards.types";
import { PrismaErrorCode, PrismaService, isPrismaError } from "../../common";
import type { Prisma } from "../../generated/prisma/client";
import { BOARD_INCLUDE } from "./boards.constants";
import type { BoardEntity, BoardListEntity, BoardWriteData } from "./boards.types";

function toJson(
  columns: BoardColumn[] | undefined,
): Prisma.InputJsonValue | undefined {
  return columns as unknown as Prisma.InputJsonValue | undefined;
}

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    skip: number,
    take: number,
  ): Promise<{ items: BoardListEntity[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.board.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take,
        omit: { columns: true },
        include: { _count: { select: { templates: true } } },
      }),
      this.prisma.board.count(),
    ]);
    return { items, total };
  }

  async findById(id: string): Promise<BoardEntity | null> {
    const entity = await this.prisma.board.findUnique({
      where: { id },
      include: BOARD_INCLUDE,
    });
    return entity as unknown as BoardEntity | null;
  }

  countTemplates(ids: string[]): Promise<number> {
    return this.prisma.template.count({ where: { id: { in: ids } } });
  }

  async create(data: BoardWriteData & { name: string }): Promise<BoardEntity> {
    const { name, columns, templateIds = [] } = data;
    const entity = await this.prisma.board.create({
      data: {
        name,
        columns: toJson(columns) ?? [],
        templates: {
          create: templateIds.map((templateId) => ({ templateId })),
        },
      },
      include: BOARD_INCLUDE,
    });
    return entity as unknown as BoardEntity;
  }

  async update(id: string, data: BoardWriteData): Promise<BoardEntity | null> {
    const { name, columns, templateIds } = data;
    try {
      const entity = await this.prisma.board.update({
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
      return entity as unknown as BoardEntity;
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
