import { Injectable } from '@nestjs/common';
import { DisplayBucket, TaskConditionOperation, ValueType } from '@tomato/constants';
import { PrismaService } from '../../common';
import type { Prisma } from '../../generated/prisma/client';
import {
  LATEST_TEMPLATE_VERSION_INCLUDE,
  SUBMISSION_DETAIL_INCLUDE,
  SUBMISSION_INCLUDE,
  SUBMISSION_OMIT,
  UPDATED_SUBMISSION_SELECT,
} from './submissions.constants';
import type {
  LatestVersionTemplate,
  SubmissionDisplayDoc,
  SubmissionClocksEntity,
  SubmissionCondition,
  SubmissionEntity,
  SubmissionDetailEntity,
  SubmissionFilter,
  SubmissionValuesUpdate,
  UpdatedSubmissionEntity,
} from './submissions.types';

function toConditionWhere({ widget, operation, value }: SubmissionCondition): Prisma.SubmissionWhereInput {
  const where = {
    dataDisplays: { path: [widget, ValueType.DEFAULT, DisplayBucket.ENTITY], array_contains: [value] },
  } satisfies Prisma.SubmissionWhereInput;
  return operation === TaskConditionOperation.IS_NOT ? { NOT: where } : where;
}

@Injectable()
export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    filters: SubmissionFilter[],
    skip: number,
    take: number,
  ): Promise<{ items: SubmissionEntity[]; total: number }> {
    const where = {
      OR: filters.map(({ templateId, conditions }) => ({
        templateVersion: { templateId },
        AND: conditions.map(toConditionWhere),
      })),
    } satisfies Prisma.SubmissionWhereInput;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.submission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: SUBMISSION_INCLUDE,
        omit: SUBMISSION_OMIT,
      }),
      this.prisma.submission.count({ where }),
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

  async findLatestVersionTemplate(templateId: string): Promise<LatestVersionTemplate | null> {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
      include: LATEST_TEMPLATE_VERSION_INCLUDE,
    });
    return template as unknown as LatestVersionTemplate | null;
  }

  async create(
    templateVersionId: string,
    createdAt: Date,
    dataDisplays: SubmissionDisplayDoc,
  ): Promise<SubmissionEntity> {
    const entity = await this.prisma.submission.create({
      data: { templateVersionId, createdAt, dataDisplays: dataDisplays as Prisma.InputJsonValue },
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
