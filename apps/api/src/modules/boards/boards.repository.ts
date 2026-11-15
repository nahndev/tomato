import { Injectable } from "@nestjs/common";
import { PrismaErrorCode, PrismaService, isPrismaError } from "../../common";
import type { Prisma } from "../../generated/prisma/client";
import { BOARD_INCLUDE } from "./boards.constants";
import type { BoardEntity, BoardListEntity, BoardWriteData } from "./boards.types";

function toJson(value: object): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
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

  async create(data: { name: string; templateIds: string[] }): Promise<BoardEntity> {
    const entity = await this.prisma.board.create({
      data: {
        name: data.name,
        templates: {
          create: data.templateIds.map((templateId) => ({ templateId })),
        },
        table: { create: {} },
        task: { create: {} },
      },
      include: BOARD_INCLUDE,
    });
    return entity as unknown as BoardEntity;
  }

  async update(id: string, data: BoardWriteData): Promise<BoardEntity | null> {
    const { name, columns, taskSettings, templateIds } = data;
    try {
      const entity = await this.prisma.board.update({
        where: { id },
        data: {
          name,
          templates: templateIds && {
            deleteMany: { templateId: { notIn: templateIds } },
            createMany: { data: templateIds.map((templateId) => ({ templateId })), skipDuplicates: true },
          },
          table: columns && { update: { columns: toJson(columns) } },
          task: taskSettings && { update: { settings: toJson(taskSettings) } },
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
