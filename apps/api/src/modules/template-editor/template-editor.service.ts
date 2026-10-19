import { ConflictException, Injectable } from '@nestjs/common';
import type { TemplateSnapshot, TemplateVersion } from '@tomato/types';
import type { TemplateVersion as TemplateVersionModel } from '../../generated/prisma/client';
import { TemplatesService } from '../templates/templates.service';
import { getNextVersion } from './next-version';
import { TemplateEditorRepository } from './template-editor.repository';
import { TemplateSnapshotClient } from './template-snapshot.client';

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
    private readonly snapshotClient: TemplateSnapshotClient,
  ) {}

  async listVersions(templateId: string): Promise<TemplateVersion[]> {
    await this.templatesService.get(templateId);
    return (await this.repository.listVersions(templateId)).map(toTemplateVersion);
  }

  async publish(templateId: string): Promise<TemplateVersion> {
    await this.templatesService.get(templateId);
    const snapshot = await this.snapshotClient.fetch(templateId);
    const latest = await this.repository.findLatestVersion(templateId);
    const entity = await this.repository.createVersion(templateId, getNextVersion(latest?.version ?? null), snapshot);
    if (!entity) throw new ConflictException();
    return toTemplateVersion(entity);
  }
}
