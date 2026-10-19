import { Injectable } from '@nestjs/common';
import type { TemplateSnapshot } from '@tomato/types';
import type { Prisma, TemplateVersion as TemplateVersionModel } from '../../generated/prisma/client';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';

@Injectable()
export class TemplateEditorRepository {
  constructor(private readonly prisma: PrismaService) {}

  listVersions(templateId: string): Promise<TemplateVersionModel[]> {
    return this.prisma.templateVersion.findMany({ where: { templateId }, orderBy: { createdAt: 'desc' } });
  }

  findLatestVersion(templateId: string): Promise<TemplateVersionModel | null> {
    return this.prisma.templateVersion.findFirst({ where: { templateId }, orderBy: { createdAt: 'desc' } });
  }

  async createVersion(
    templateId: string,
    version: string,
    snapshot: TemplateSnapshot,
  ): Promise<TemplateVersionModel | null> {
    try {
      return await this.prisma.templateVersion.create({
        data: { templateId, version, snapshot: snapshot as unknown as Prisma.InputJsonValue },
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.UNIQUE_VIOLATION)) return null;
      throw error;
    }
  }
}
