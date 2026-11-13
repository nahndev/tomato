import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import type { Prisma } from '../../generated/prisma/client';
import { BOARD_TEMPLATE_INCLUDE } from '../boards/boards.constants';
import type { BoardTemplateEntity } from '../boards/boards.types';
import {
  SUBMISSION_DETAIL_INCLUDE,
  SUBMISSION_INCLUDE,
  SUBMISSION_OMIT,
  UPDATED_SUBMISSION_SELECT,
} from './submissions.constants';
import type {
  SubmissionDisplayDoc,
  SubmissionClocksEntity,
  SubmissionEntity,
  SubmissionDetailEntity,
  SubmissionValuesUpdate,
  UpdatedSubmissionEntity,
} from './submissions.types';

@Injectable()
export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(boardId: string, skip: number, take: number): Promise<{ items: SubmissionEntity[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.submission.findMany({
        where: { boardId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: SUBMISSION_INCLUDE,
        omit: SUBMISSION_OMIT,
      }),
      this.prisma.submission.count({ where: { boardId } }),
    ]);
    return { items: items as unknown as SubmissionEntity[], total };
  }

  async findById(id: string): Promise<SubmissionDetailEntity | null> {
    const entity = await this.prisma.submission.findUnique({
      where: { id },
      include: SUBMISSION_DETAIL_INCLUDE,
      omit: SUBMISSION_OMIT,
    });
    return entity as unknown as SubmissionDetailEntity | null;
  }

  async findWithClocks(id: string): Promise<SubmissionClocksEntity | null> {
    const entity = await this.prisma.submission.findUnique({ where: { id }, include: SUBMISSION_DETAIL_INCLUDE });
    return entity as unknown as SubmissionClocksEntity | null;
  }

  async findLinkedTemplate(boardId: string, templateId: string): Promise<BoardTemplateEntity | null> {
    const link = await this.prisma.boardTemplate.findUnique({
      where: { boardId_templateId: { boardId, templateId } },
      include: BOARD_TEMPLATE_INCLUDE,
    });
    return link as unknown as BoardTemplateEntity | null;
  }

  async create(
    boardId: string,
    templateVersionId: string,
    createdAt: Date,
    dataDisplays: SubmissionDisplayDoc,
  ): Promise<SubmissionEntity> {
    const entity = await this.prisma.submission.create({
      data: { boardId, templateVersionId, createdAt, dataDisplays: dataDisplays as Prisma.InputJsonValue },
      include: SUBMISSION_INCLUDE,
      omit: SUBMISSION_OMIT,
    });
    return entity as unknown as SubmissionEntity;
  }

  async updateValues(
    id: string,
    { data, dataClocks, dataDisplays, title, metaClocks }: SubmissionValuesUpdate,
  ): Promise<UpdatedSubmissionEntity> {
    const entity = await this.prisma.submission.update({
      where: { id },
      data: {
        data: data as Prisma.InputJsonValue,
        dataClocks: dataClocks as Prisma.InputJsonValue,
        dataDisplays: dataDisplays as Prisma.InputJsonValue,
        title,
        metaClocks: metaClocks as Prisma.InputJsonValue,
      },
      select: UPDATED_SUBMISSION_SELECT,
    });
    return entity as unknown as UpdatedSubmissionEntity;
  }

  async delete(id: string): Promise<boolean> {
    const [, { count }] = await this.prisma.$transaction([
      this.prisma.submission.deleteMany({ where: { dependents: { some: { sourceId: id } } } }),
      this.prisma.submission.deleteMany({ where: { id } }),
    ]);
    return count > 0;
  }
}
