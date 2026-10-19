import { Injectable } from '@nestjs/common';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { Prisma } from '../../generated/prisma/client';

const WITH_TEMPLATE_ID = { templateVersion: { select: { templateId: true } } } satisfies Prisma.SubmissionInclude;
const WITH_TEMPLATE_VERSION = { templateVersion: true } satisfies Prisma.SubmissionInclude;

export type SubmissionEntity = Prisma.SubmissionGetPayload<{ include: typeof WITH_TEMPLATE_ID }>;
export type SubmissionDetailEntity = Prisma.SubmissionGetPayload<{ include: typeof WITH_TEMPLATE_VERSION }>;

export interface SubmissionValuesUpdate {
  data: Record<string, unknown>;
  dataClocks: Record<string, number>;
  dataDisplays: Record<string, unknown>;
}

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
        include: WITH_TEMPLATE_ID,
      }),
      this.prisma.submission.count({ where: { boardId } }),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<SubmissionDetailEntity | null> {
    return this.prisma.submission.findUnique({ where: { id }, include: WITH_TEMPLATE_VERSION });
  }

  findLinkedTemplate(boardId: string, templateId: string) {
    return this.prisma.boardTemplate.findUnique({
      where: { boardId_templateId: { boardId, templateId } },
      include: { template: { include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } } } },
    });
  }

  create(boardId: string, templateVersionId: string, createdAt: Date, dataDisplays: Record<string, unknown>) {
    return this.prisma.submission.create({
      data: { boardId, templateVersionId, createdAt, dataDisplays: dataDisplays as Prisma.InputJsonValue },
      include: WITH_TEMPLATE_ID,
    });
  }

  async updateValues(id: string, { data, dataClocks, dataDisplays }: SubmissionValuesUpdate): Promise<void> {
    await this.prisma.submission.update({
      where: { id },
      data: {
        data: data as Prisma.InputJsonValue,
        dataClocks: dataClocks as Prisma.InputJsonValue,
        dataDisplays: dataDisplays as Prisma.InputJsonValue,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.submission.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.RECORD_NOT_FOUND)) return false;
      throw error;
    }
  }
}
