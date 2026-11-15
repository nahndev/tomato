import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';

@Injectable()
export class BoardAgendaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async add(boardId: string): Promise<void> {
    await this.prisma.boardAgenda.upsert({ where: { boardId }, create: { boardId }, update: {} });
  }

  async remove(boardId: string): Promise<void> {
    await this.prisma.boardAgenda.deleteMany({ where: { boardId } });
  }
}
