import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import type { Prisma } from '../../../generated/prisma/client';
import type { BoardColumn } from '../boards.types';

@Injectable()
export class BoardTableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(boardId: string, setting: BoardColumn[]): Promise<void> {
    await this.prisma.board.update({
      where: { id: boardId },
      data: { tableSetting: setting as unknown as Prisma.InputJsonValue },
    });
  }
}
