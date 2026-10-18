import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import type { TemplateVersion as TemplateVersionModel } from '../../generated/prisma/client';
import type { TemplatesService } from '../templates/templates.service';
import type { TemplateEditorRepository } from './template-editor.repository';
import { TemplateEditorService } from './template-editor.service';

const TEMPLATE_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const MISSING_ID = '7d1e9a52-0c3b-4f48-8a6e-2b5c9d4e1f70';

function makeVersion(version: string): TemplateVersionModel {
  return {
    id: crypto.randomUUID(),
    templateId: TEMPLATE_ID,
    version,
    snapshot: { name: 'Intake' } as unknown as TemplateVersionModel['snapshot'],
    createdAt: new Date(),
  };
}

class FakeRepository {
  versions: TemplateVersionModel[] = [];

  async listVersions(templateId: string) {
    return this.versions.filter((entry) => entry.templateId === templateId);
  }
}

class FakeTemplates {
  async get(id: string) {
    if (id !== TEMPLATE_ID) throw new NotFoundException();
    return { id, name: 'Intake' };
  }
}

describe('TemplateEditorService', () => {
  let repository: FakeRepository;
  let service: TemplateEditorService;

  beforeEach(() => {
    repository = new FakeRepository();
    service = new TemplateEditorService(
      repository as unknown as TemplateEditorRepository,
      new FakeTemplates() as unknown as TemplatesService,
    );
  });

  it('lists the versions of a template', async () => {
    repository.versions = [makeVersion('1.1.0'), makeVersion('1.0.0')];

    const versions = await service.listVersions(TEMPLATE_ID);

    expect(versions.map((entry) => entry.version)).toEqual(['1.1.0', '1.0.0']);
  });

  it('rejects an unknown template', async () => {
    await expect(service.listVersions(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });
});
