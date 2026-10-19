import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { WidgetType } from '@tomato/constants';
import type { TemplateSnapshot } from '@tomato/types';
import { beforeEach, describe, expect, it } from 'vitest';
import type { SubmissionDetailEntity, SubmissionValuesUpdate, SubmissionsRepository } from './submissions.repository';
import { SubmissionsService } from './submissions.service';

const BOARD_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const TEMPLATE_ID = '7d1e9a52-0c3b-4f48-8a6e-2b5c9d4e1f70';
const UNPUBLISHED_ID = 'c2b6d8f0-3e4a-4c1b-9d7e-5a8f1b2c3d4e';
const VERSION_ID = '9e0f1a2b-3c4d-4e5f-8a6b-7c8d9e0f1a2b';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';

const SNAPSHOT: TemplateSnapshot = {
  name: 'Intake',
  widgets: { name: { id: 'name', type: WidgetType.TEXT, label: 'Name' } },
  layouts: {},
  widgetToSession: {},
  sessions: {},
};

class FakeRepository {
  readonly store = new Map<string, SubmissionDetailEntity>();
  updates: SubmissionValuesUpdate[] = [];

  async findMany() {
    return { items: [], total: 0 };
  }
  async findById(id: string) {
    return this.store.get(id) ?? null;
  }
  async findLinkedTemplate(boardId: string, templateId: string) {
    if (boardId !== BOARD_ID) return null;
    if (templateId === UNPUBLISHED_ID) return { template: { versions: [] } };
    if (templateId !== TEMPLATE_ID) return null;
    return { template: { versions: [{ id: VERSION_ID, snapshot: SNAPSHOT }] } };
  }
  async create(boardId: string, templateVersionId: string, createdAt: Date, dataDisplays: Record<string, unknown>) {
    const entity = {
      id: crypto.randomUUID(),
      boardId,
      templateVersionId,
      data: {},
      dataClocks: {},
      dataDisplays,
      createdAt,
      updatedAt: createdAt,
      templateVersion: { id: templateVersionId, templateId: TEMPLATE_ID, version: '1.0.0', snapshot: SNAPSHOT, createdAt },
    } as unknown as SubmissionDetailEntity;
    this.store.set(entity.id, entity);
    return entity;
  }
  async updateValues(id: string, update: SubmissionValuesUpdate) {
    this.updates.push(update);
    const current = this.store.get(id)!;
    this.store.set(id, { ...current, ...update } as SubmissionDetailEntity);
  }
  async delete(id: string) {
    return this.store.delete(id);
  }
}

describe('SubmissionsService', () => {
  let repository: FakeRepository;
  let service: SubmissionsService;

  beforeEach(() => {
    repository = new FakeRepository();
    service = new SubmissionsService(repository as unknown as SubmissionsRepository);
  });

  it('creates a submission from the latest version of a linked template', async () => {
    const submission = await service.create({ boardId: BOARD_ID, templateId: TEMPLATE_ID });

    expect(submission.templateVersionId).toBe(VERSION_ID);
    expect(submission.templateId).toBe(TEMPLATE_ID);
    expect(submission.dataDisplays.name.default).toEqual({ text: '' });
  });

  it('rejects a template that is not linked to the board', async () => {
    await expect(service.create({ boardId: BOARD_ID, templateId: MISSING_ID })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a template without a published version', async () => {
    await expect(service.create({ boardId: BOARD_ID, templateId: UNPUBLISHED_ID })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('returns the template version with a submission', async () => {
    const { id } = await service.create({ boardId: BOARD_ID, templateId: TEMPLATE_ID });

    expect((await service.get(id)).templateVersion.snapshot.name).toBe('Intake');
  });

  describe('applyValues', () => {
    it('stores the values and refreshes the display doc', async () => {
      const { id } = await service.create({ boardId: BOARD_ID, templateId: TEMPLATE_ID });

      await service.applyValues(id, { name: { value: 'Ada', clock: 3 } });

      const { data, dataDisplays } = await service.get(id);
      expect(data).toEqual({ name: 'Ada' });
      expect(dataDisplays.name.default).toEqual({ text: 'Ada' });
    });

    it('skips a key whose clock has not changed', async () => {
      const { id } = await service.create({ boardId: BOARD_ID, templateId: TEMPLATE_ID });
      await service.applyValues(id, { name: { value: 'Ada', clock: 3 } });

      await service.applyValues(id, { name: { value: 'Stale', clock: 3 } });

      expect(repository.updates).toHaveLength(1);
      expect((await service.get(id)).data).toEqual({ name: 'Ada' });
    });

    it('ignores keys that are not widgets of the template', async () => {
      const { id } = await service.create({ boardId: BOARD_ID, templateId: TEMPLATE_ID });

      await service.applyValues(id, { rogue: { value: 'x', clock: 1 } });

      expect(repository.updates).toHaveLength(0);
    });

    it('throws NotFound for an unknown submission', async () => {
      await expect(service.applyValues(MISSING_ID, {})).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  it('removes a submission and throws NotFound for an unknown one', async () => {
    const { id } = await service.create({ boardId: BOARD_ID, templateId: TEMPLATE_ID });

    await service.remove(id);

    await expect(service.get(id)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
