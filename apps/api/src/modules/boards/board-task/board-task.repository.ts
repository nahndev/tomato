import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import type { BoardTaskSettingDto } from './dto/board-task-setting.dto';

@Injectable()
export class BoardTaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(boardId: string, settings: BoardTaskSettingDto[]): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.boardTask.upsert({ where: { boardId }, create: { boardId }, update: { updatedAt: new Date() } }),
      this.prisma.boardTemplateTaskSetting.deleteMany({ where: { boardId } }),
      this.prisma.boardTemplateTaskSetting.createMany({
        data: settings.map((setting) => ({
          boardId,
          templateId: setting.templateId,
          typeWidget: setting.typeWidget ?? null,
          titleWidget: setting.titleWidget ?? null,
          statusWidget: setting.statusWidget ?? null,
          assigneeWidget: setting.assigneeWidget ?? null,
          conditions: setting.conditions.map(({ widget, operation, value }) => ({ widget, operation, value })),
        })),
      }),
    ]);
  }

  async remove(boardId: string): Promise<void> {
    await this.prisma.boardTask.deleteMany({ where: { boardId } });
  }
}
