import { Injectable } from '@nestjs/common';
import type { TemplateSnapshot, TemplateVersion } from '@tomato/types';
import type { TemplateVersion as TemplateVersionModel } from '../../generated/prisma/client';
import { TemplatesService } from '../templates/templates.service';
import { TemplateEditorRepository } from './template-editor.repository';

function toTemplateVersion(entity: TemplateVersionModel): TemplateVersion {
  return {
    id: entity.id,
    templateId: entity.templateId,
    version: entity.version,
    snapshot: entity.snapshot as unknown as TemplateSnapshot,
    createdAt: entity.createdAt.toISOString(),
  };
}

@Injectable()
export class TemplateEditorService {
  constructor(
    private readonly repository: TemplateEditorRepository,
    private readonly templatesService: TemplatesService,
  ) {}

  async listVersions(templateId: string): Promise<TemplateVersion[]> {
    await this.templatesService.get(templateId);
    return (await this.repository.listVersions(templateId)).map(toTemplateVersion);
  }
}
