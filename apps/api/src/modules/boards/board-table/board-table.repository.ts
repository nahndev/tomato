import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import type { Prisma } from '../../../generated/prisma/client';
import type { BoardTableColumn, BoardTableSettingEntity } from '../boards.types';

@Injectable()
export class BoardTableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    boardId: string,
    columns: BoardTableColumn[],
    settings: Pick<BoardTableSettingEntity, 'templateId' | 'items'>[],
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.board.update({
        where: { id: boardId },
        data: { tableColumns: columns as unknown as Prisma.InputJsonValue },
      }),
      this.prisma.boardTemplateTableSetting.deleteMany({ where: { boardId } }),
      this.prisma.boardTemplateTableSetting.createMany({
        data: settings.map(({ templateId, items }) => ({
          boardId,
          templateId,
          items: items as unknown as Prisma.InputJsonValue,
        })),
      }),
    ]);
  }
}
