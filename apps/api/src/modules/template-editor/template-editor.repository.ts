import { Injectable } from '@nestjs/common';
import type { TemplateSnapshot } from './template-editor.types';
import type { Prisma } from '../../generated/prisma/client';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { TemplateVersionEntity } from './template-editor.types';

@Injectable()
export class TemplateEditorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listVersions(templateId: string): Promise<TemplateVersionEntity[]> {
    const versions = await this.prisma.templateVersion.findMany({ where: { templateId }, orderBy: { createdAt: 'desc' } });
    return versions as unknown as TemplateVersionEntity[];
  }

  async findLatestVersion(templateId: string): Promise<TemplateVersionEntity | null> {
    const version = await this.prisma.templateVersion.findFirst({ where: { templateId }, orderBy: { createdAt: 'desc' } });
    return version as unknown as TemplateVersionEntity | null;
  }

  async createVersion(
    templateId: string,
    version: string,
    snapshot: TemplateSnapshot,
  ): Promise<TemplateVersionEntity | null> {
    try {
      const entity = await this.prisma.templateVersion.create({
        data: { templateId, version, snapshot: snapshot as unknown as Prisma.InputJsonValue },
      });
      return entity as unknown as TemplateVersionEntity;
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.UNIQUE_VIOLATION)) return null;
      throw error;
    }
  }
}
