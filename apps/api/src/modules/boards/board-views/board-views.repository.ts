import { Injectable } from '@nestjs/common';
import { BoardView } from '@tomato/constants';
import { PrismaService } from '../../../common';
import type { Prisma } from '../../../generated/prisma/client';
import type { BoardColumn } from '../boards.types';

@Injectable()
export class BoardViewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveTable(boardId: string, columns: BoardColumn[]): Promise<void> {
    const json = columns as unknown as Prisma.InputJsonValue;
    await this.prisma.boardTable.upsert({
      where: { boardId },
      create: { boardId, columns: json },
      update: { columns: json },
    });
  }

  async add(boardId: string, view: typeof BoardView.TASK | typeof BoardView.AGENDA): Promise<void> {
    const args = { where: { boardId }, create: { boardId }, update: {} };
    if (view === BoardView.TASK) await this.prisma.boardTask.upsert(args);
    else await this.prisma.boardAgenda.upsert(args);
  }

  async remove(boardId: string, view: BoardView): Promise<void> {
    const args = { where: { boardId } };
    if (view === BoardView.TABLE) await this.prisma.boardTable.deleteMany(args);
    else if (view === BoardView.TASK) await this.prisma.boardTask.deleteMany(args);
    else await this.prisma.boardAgenda.deleteMany(args);
  }
}
