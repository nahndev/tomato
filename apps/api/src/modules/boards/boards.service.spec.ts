import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DisplayType, ValueType } from '@tomato/constants';
import type { BoardColumn } from '@tomato/types';
import { beforeEach, describe, expect, it } from 'vitest';
import type { BoardEntity, BoardWriteData, BoardsRepository } from './boards.repository';
import { BoardsService } from './boards.service';

const TEMPLATE_A = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const TEMPLATE_B = '7d1e9a52-0c3b-4f48-8a6e-2b5c9d4e1f70';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';

const column = (versionIds: string[]): BoardColumn => ({
  id: crypto.randomUUID(),
  type: DisplayType.TEXT,
  size: { flex: 1 },
  label: 'Name',
  items: Object.fromEntries(versionIds.map((id) => [id, { widgetId: 'w1', property: ValueType.DEFAULT }])),
});

const UNPUBLISHED = TEMPLATE_B;
const hasVersion = (templateId: string) => templateId !== UNPUBLISHED;

function makeEntity(id: string, data: BoardWriteData & { name: string }): BoardEntity {
  const now = new Date();
  return {
    id,
    name: data.name,
    columns: (data.columns ?? []) as unknown as BoardEntity['columns'],
    createdAt: now,
    updatedAt: now,
    templates: (data.templateIds ?? []).map((templateId) => ({
      boardId: id,
      templateId,
      template: {
        id: templateId,
        name: 'Intake',
        description: null,
        previewImageUrl: null,
        categoryId: 'c1',
        createdAt: now,
        updatedAt: now,
        versions: hasVersion(templateId)
          ? [{ id: 'v1', templateId, version: '1.0.0', snapshot: {}, createdAt: now }]
          : [],
      },
    })),
  };
}

class FakeRepository {
  readonly store = new Map<string, BoardEntity>();
  readonly knownTemplates = new Set([TEMPLATE_A, TEMPLATE_B]);

  async findMany() {
    return { items: [], total: 0 };
  }
  async findById(id: string) {
    return this.store.get(id) ?? null;
  }
  async countTemplates(ids: string[]) {
    return ids.filter((id) => this.knownTemplates.has(id)).length;
  }
  async create(data: BoardWriteData & { name: string }) {
    const entity = makeEntity(crypto.randomUUID(), data);
    this.store.set(entity.id, entity);
    return entity;
  }
  async update(id: string, data: BoardWriteData) {
    const current = this.store.get(id);
    if (!current) return null;
    const next = makeEntity(id, {
      name: data.name ?? current.name,
      columns: data.columns ?? (current.columns as unknown as BoardColumn[]),
      templateIds: data.templateIds ?? current.templates.map((link) => link.templateId),
    });
    this.store.set(id, next);
    return next;
  }
  async delete(id: string) {
    return this.store.delete(id);
  }
}

describe('BoardsService', () => {
  let service: BoardsService;

  beforeEach(() => {
    service = new BoardsService(new FakeRepository() as unknown as BoardsRepository);
  });

  it('creates a board with linked templates and columns', async () => {
    const board = await service.create({
      name: 'Leads',
      templateIds: [TEMPLATE_A],
      columns: [column([TEMPLATE_A])],
    });

    expect(board.templates.map((entry) => entry.id)).toEqual([TEMPLATE_A]);
    expect(board.templates[0].name).toBe('Intake');
    expect(board.templates[0].latestVersion?.version).toBe('1.0.0');
    expect(board.columns).toHaveLength(1);
  });

  it('exposes no latest version for an unpublished template', async () => {
    const board = await service.create({ name: 'Leads', templateIds: [TEMPLATE_B] });

    expect(board.templates[0].latestVersion).toBeNull();
  });

  it('rejects an unknown template', async () => {
    await expect(service.create({ name: 'Leads', templateIds: [MISSING_ID] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a column that references a template the board does not link', async () => {
    await expect(
      service.create({ name: 'Leads', templateIds: [TEMPLATE_A], columns: [column([TEMPLATE_B])] }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('prunes existing column items when a template is unlinked', async () => {
    const created = await service.create({
      name: 'Leads',
      templateIds: [TEMPLATE_A, TEMPLATE_B],
      columns: [column([TEMPLATE_A, TEMPLATE_B])],
    });

    const updated = await service.update(created.id, { templateIds: [TEMPLATE_A] });

    expect(Object.keys(updated.columns[0].items)).toEqual([TEMPLATE_A]);
  });

  it('keeps the linked templates when only the name changes', async () => {
    const created = await service.create({ name: 'Leads', templateIds: [TEMPLATE_A] });

    const updated = await service.update(created.id, { name: 'Sales' });

    expect(updated.name).toBe('Sales');
    expect(updated.templates).toHaveLength(1);
  });

  it('throws NotFound for an unknown board', async () => {
    await expect(service.get(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.update(MISSING_ID, { name: 'A' })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });
});
