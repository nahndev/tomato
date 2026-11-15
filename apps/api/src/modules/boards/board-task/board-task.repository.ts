import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import type { Prisma } from '../../../generated/prisma/client';
import type { BoardTaskSettingDto } from './dto/board-task-setting.dto';

@Injectable()
export class BoardTaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(boardId: string, setting: BoardTaskSettingDto[]): Promise<void> {
    const json: Prisma.InputJsonValue = Object.fromEntries(
      setting.map((entry) => [
        entry.templateId,
        {
          typeWidget: entry.typeWidget ?? null,
          titleWidget: entry.titleWidget ?? null,
          statusWidget: entry.statusWidget ?? null,
          assigneeWidget: entry.assigneeWidget ?? null,
          conditions: entry.conditions.map(({ widget, operation, value }) => ({ widget, operation, value })),
        },
      ]),
    );
    await this.prisma.board.update({ where: { id: boardId }, data: { taskSetting: json } });
  }
}
