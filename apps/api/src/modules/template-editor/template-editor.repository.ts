import { Injectable } from '@nestjs/common';
import type { TemplateVersion as TemplateVersionModel } from '../../generated/prisma/client';
import { PrismaService } from '../../common';

@Injectable()
export class TemplateEditorRepository {
  constructor(private readonly prisma: PrismaService) {}

  listVersions(templateId: string): Promise<TemplateVersionModel[]> {
    return this.prisma.templateVersion.findMany({ where: { templateId }, orderBy: { createdAt: 'desc' } });
  }
}
