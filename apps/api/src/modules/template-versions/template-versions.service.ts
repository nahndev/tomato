import { ConflictException, Injectable } from '@nestjs/common';
import { TemplatesService } from '../templates/templates.service';
import { getNextVersion } from './next-version';
import { TemplateVersionsRepository } from './template-versions.repository';
import { TemplateSnapshotClient } from './template-snapshot.client';
import type { TemplateVersionEntity } from './template-versions.types';

@Injectable()
export class TemplateVersionsService {
  constructor(
    private readonly repository: TemplateVersionsRepository,
    private readonly templatesService: TemplatesService,
    private readonly snapshotClient: TemplateSnapshotClient,
  ) {}

  async listVersions(templateId: string): Promise<TemplateVersionEntity[]> {
    await this.templatesService.get(templateId);
    return this.repository.listVersions(templateId);
  }

  async publish(templateId: string): Promise<TemplateVersionEntity> {
    await this.templatesService.get(templateId);
    const snapshot = await this.snapshotClient.fetch(templateId);
    const latest = await this.repository.findLatestVersion(templateId);
    const entity = await this.repository.createVersion(templateId, getNextVersion(latest?.version ?? null), snapshot);
    if (!entity) throw new ConflictException();
    return entity;
  }
}
