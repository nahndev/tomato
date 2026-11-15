import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import type { Prisma } from '../../../generated/prisma/client';
import type { BoardTaskSettingDto } from './dto/board-task-setting.dto';

@Injectable()
export class BoardTaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(boardId: string, settings: BoardTaskSettingDto[]): Promise<void> {
    const json: Prisma.InputJsonValue = Object.fromEntries(
      settings.map((setting) => [
        setting.templateId,
        {
          typeWidget: setting.typeWidget ?? null,
          titleWidget: setting.titleWidget ?? null,
          statusWidget: setting.statusWidget ?? null,
          assigneeWidget: setting.assigneeWidget ?? null,
          conditions: setting.conditions.map(({ widget, operation, value }) => ({ widget, operation, value })),
        },
      ]),
    );
    await this.prisma.boardTask.upsert({
      where: { boardId },
      create: { boardId, settings: json },
      update: { settings: json },
    });
  }
}
