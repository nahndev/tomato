import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import type { Prisma } from '../../../generated/prisma/client';
import type { BoardColumn } from '../boards.types';

@Injectable()
export class BoardTableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(boardId: string, columns: BoardColumn[]): Promise<void> {
    const json = columns as unknown as Prisma.InputJsonValue;
    await this.prisma.boardTable.upsert({
      where: { boardId },
      create: { boardId, columns: json },
      update: { columns: json },
    });
  }

  async remove(boardId: string): Promise<void> {
    await this.prisma.boardTable.deleteMany({ where: { boardId } });
  }
}
