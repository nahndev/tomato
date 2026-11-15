import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DisplayType, ValueType } from '@tomato/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import type { TemplateSnapshot } from '../template-versions/template-versions.types';
import type { BoardsRepository } from './boards.repository';
import { BoardsService } from './boards.service';
import type { BoardColumn, BoardEntity, BoardTableEntity, BoardTaskEntity, BoardWriteData } from './boards.types';

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

const SNAPSHOT: TemplateSnapshot = { name: 'Intake', widgets: {}, layouts: {}, widgetToSession: {}, sessions: {}, links: {}, behaviors: {} };

const UNPUBLISHED = TEMPLATE_B;
const hasVersion = (templateId: string) => templateId !== UNPUBLISHED;

function makeEntity(
  id: string,
  name: string,
  templateIds: string[],
  table: BoardTableEntity | null,
  task: BoardTaskEntity | null,
): BoardEntity {
  const now = new Date();
  return {
    id,
    name,
    createdAt: now,
    updatedAt: now,
    table,
    task,
    agenda: null,
    templates: templateIds.map((templateId) => ({
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
          ? [{ id: 'v1', templateId, version: '1.0.0', snapshot: SNAPSHOT, createdAt: now }]
          : [],
      },
    })),
  };
}

const makeTable = (boardId: string, columns: BoardColumn[]): BoardTableEntity => {
  const now = new Date();
  return { boardId, columns, createdAt: now, updatedAt: now };
};

const makeTask = (boardId: string, settings: BoardTaskEntity['settings']): BoardTaskEntity => {
  const now = new Date();
  return { boardId, settings, createdAt: now, updatedAt: now };
};

const taskSetting = () => ({
  typeWidget: null,
  titleWidget: null,
  statusWidget: 'w-status',
  assigneeWidget: null,
  conditions: [],
});

class FakeBoardsRepository {
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
  async create(data: { name: string; templateIds: string[] }) {
    const id = crypto.randomUUID();
    const entity = makeEntity(id, data.name, data.templateIds, makeTable(id, []), makeTask(id, {}));
    this.store.set(id, entity);
    return entity;
  }
  async update(id: string, data: BoardWriteData) {
    const current = this.store.get(id);
    if (!current) return null;
    const next = {
      ...makeEntity(
        id,
        data.name ?? current.name,
        data.templateIds ?? current.templates.map((link) => link.templateId),
        current.table && (data.columns ? makeTable(id, data.columns) : current.table),
        current.task && (data.taskSettings ? makeTask(id, data.taskSettings) : current.task),
      ),
      agenda: current.agenda,
    };
    this.store.set(id, next);
    return next;
  }
  async delete(id: string) {
    return this.store.delete(id);
  }
}

describe('BoardsService', () => {
  let repository: FakeBoardsRepository;
  let service: BoardsService;

  beforeEach(() => {
    repository = new FakeBoardsRepository();
    service = new BoardsService(repository as unknown as BoardsRepository);
  });

  it('creates a board with linked templates and empty table and task views', async () => {
    const board = await service.create({ name: 'Leads', templateIds: [TEMPLATE_A] });

    expect(board.templates.map((entry) => entry.templateId)).toEqual([TEMPLATE_A]);
    expect(board.templates[0].template.name).toBe('Intake');
    expect(board.templates[0].template.versions[0]?.version).toBe('1.0.0');
    expect(board.table?.columns).toEqual([]);
    expect(board.task?.settings).toEqual({});
    expect(board.agenda).toBeNull();
  });

  it('exposes no latest version for an unpublished template', async () => {
    const board = await service.create({ name: 'Leads', templateIds: [TEMPLATE_B] });

    expect(board.templates[0].template.versions).toEqual([]);
  });

  it('rejects an unknown template', async () => {
    await expect(service.create({ name: 'Leads', templateIds: [MISSING_ID] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('prunes table column items when a template is unlinked', async () => {
    const created = await service.create({ name: 'Leads', templateIds: [TEMPLATE_A, TEMPLATE_B] });
    await repository.update(created.id, { columns: [column([TEMPLATE_A, TEMPLATE_B])] });

    const updated = await service.update(created.id, { templateIds: [TEMPLATE_A] });

    expect(Object.keys(updated.table?.columns[0].items ?? {})).toEqual([TEMPLATE_A]);
  });

  it('prunes task settings when a template is unlinked', async () => {
    const created = await service.create({ name: 'Leads', templateIds: [TEMPLATE_A, TEMPLATE_B] });
    await repository.update(created.id, { taskSettings: { [TEMPLATE_A]: taskSetting(), [TEMPLATE_B]: taskSetting() } });

    const updated = await service.update(created.id, { templateIds: [TEMPLATE_A] });

    expect(Object.keys(updated.task?.settings ?? {})).toEqual([TEMPLATE_A]);
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
