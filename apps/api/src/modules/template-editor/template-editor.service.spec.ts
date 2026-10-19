import { ConflictException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import type { TemplateVersion as TemplateVersionModel } from '../../generated/prisma/client';
import type { TemplateSnapshot } from '@tomato/types';
import type { TemplatesService } from '../templates/templates.service';
import type { TemplateEditorRepository } from './template-editor.repository';
import { TemplateEditorService } from './template-editor.service';
import type { TemplateSnapshotClient } from './template-snapshot.client';

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
  hasConflict = false;

  async listVersions(templateId: string) {
    return this.versions.filter((entry) => entry.templateId === templateId);
  }

  async findLatestVersion(templateId: string) {
    return (await this.listVersions(templateId))[0] ?? null;
  }

  async createVersion(templateId: string, version: string, snapshot: TemplateSnapshot) {
    if (this.hasConflict) return null;
    const entity = { ...makeVersion(version), templateId, snapshot: snapshot as unknown as TemplateVersionModel['snapshot'] };
    this.versions.unshift(entity);
    return entity;
  }
}

class FakeTemplates {
  async get(id: string) {
    if (id !== TEMPLATE_ID) throw new NotFoundException();
    return { id, name: 'Intake' };
  }
}

const SNAPSHOT: TemplateSnapshot = { name: 'Intake', widgets: {}, layouts: {}, widgetToSession: {}, sessions: {} };

class FakeSnapshotClient {
  async fetch() {
    return SNAPSHOT;
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
      new FakeSnapshotClient() as unknown as TemplateSnapshotClient,
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

  it('publishes the first version as 1.0.0', async () => {
    const version = await service.publish(TEMPLATE_ID);

    expect(version).toMatchObject({ templateId: TEMPLATE_ID, version: '1.0.0', snapshot: SNAPSHOT });
  });

  it('bumps the minor version on each publish', async () => {
    repository.versions = [makeVersion('1.0.0')];

    expect((await service.publish(TEMPLATE_ID)).version).toBe('1.1.0');
  });

  it('rejects publishing an unknown template', async () => {
    await expect(service.publish(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('reports a version collision as a conflict', async () => {
    repository.versions = [makeVersion('1.0.0')];
    repository.hasConflict = true;

    await expect(service.publish(TEMPLATE_ID)).rejects.toBeInstanceOf(ConflictException);
  });
});
