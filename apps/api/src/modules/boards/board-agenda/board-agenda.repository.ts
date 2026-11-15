import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import type { Prisma } from '../../../generated/prisma/client';
import type { BoardAgendaSettingDto } from './dto/board-agenda-setting.dto';

@Injectable()
export class BoardAgendaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(boardId: string, setting: BoardAgendaSettingDto[]): Promise<void> {
    const json: Prisma.InputJsonValue = Object.fromEntries(
      setting.map((entry) => [
        entry.templateId,
        {
          titleWidget: entry.titleWidget ?? null,
          startWidget: entry.startWidget,
          endWidget: entry.endWidget ?? null,
        },
      ]),
    );
    await this.prisma.board.update({ where: { id: boardId }, data: { agendaSetting: json } });
  }
}
