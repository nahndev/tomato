import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DisplayType, ValueType } from '@tomato/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PaginationQueryDto } from '../../../common';
import type { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionFilter } from '../../submissions/submissions.types';
import type { BoardsService } from '../boards.service';
import type { BoardColumn, BoardEntity, BoardTableColumn, BoardTableSettingEntity } from '../boards.types';
import type { BoardTableRepository } from './board-table.repository';
import { BoardTableService } from './board-table.service';

const BOARD_ID = '0c9a7e3d-2b41-4f6a-8d5e-9f1b2c3d4e5a';
const TEMPLATE_A = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const TEMPLATE_B = '7d1e9a52-0c3b-4f48-8a6e-2b5c9d4e1f70';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';
const PAGINATION: PaginationQueryDto = { page: 1, pageSize: 20 };
const ITEM = { widgetId: 'w1', property: ValueType.DEFAULT };

type TableSettingData = Pick<BoardTableSettingEntity, 'templateId' | 'items'>;

const column = (templateIds: string[]): BoardColumn => ({
  id: crypto.randomUUID(),
  type: DisplayType.TEXT,
  size: { flex: 1 },
  label: 'Name',
  items: Object.fromEntries(templateIds.map((id) => [id, ITEM])),
});

function makeBoard(): BoardEntity {
  const now = new Date();
  return {
    id: BOARD_ID,
    name: 'Leads',
    createdAt: now,
    updatedAt: now,
    tableColumns: [],
    templates: [TEMPLATE_A, TEMPLATE_B].map(
      (templateId) =>
        ({ boardId: BOARD_ID, templateId, tableSetting: null, taskSetting: null }) as BoardEntity['templates'][number],
    ),
  };
}

class FakeBoards {
  board = makeBoard();

  async get(id: string) {
    if (id !== this.board.id) throw new NotFoundException();
    return this.board;
  }
}

class FakeRepository {
  columns: BoardTableColumn[] | null = null;
  settings: TableSettingData[] | null = null;

  async save(_boardId: string, columns: BoardTableColumn[], settings: TableSettingData[]) {
    this.columns = columns;
    this.settings = settings;
  }
}

class FakeSubmissions {
  filters: SubmissionFilter[] | null = null;

  async list(filters: SubmissionFilter[], { page, pageSize }: PaginationQueryDto) {
    this.filters = filters;
    return { items: [], total: 0, page, pageSize };
  }
}

describe('BoardTableService', () => {
  let service: BoardTableService;
  let repository: FakeRepository;
  let submissions: FakeSubmissions;

  beforeEach(() => {
    repository = new FakeRepository();
    submissions = new FakeSubmissions();
    service = new BoardTableService(
      new FakeBoards() as unknown as BoardsService,
      repository as unknown as BoardTableRepository,
      submissions as unknown as SubmissionsService,
    );
  });

  it('saves the columns on the board and their items per template', async () => {
    const shared = column([TEMPLATE_A, TEMPLATE_B]);
    const onlyA = column([TEMPLATE_A]);

    await service.save(BOARD_ID, { columns: [shared, onlyA] });

    expect(repository.columns).toEqual([shared, onlyA].map(({ id, type, size, label }) => ({ id, type, size, label })));
    expect(repository.settings).toEqual([
      { templateId: TEMPLATE_A, items: { [shared.id]: ITEM, [onlyA.id]: ITEM } },
      { templateId: TEMPLATE_B, items: { [shared.id]: ITEM } },
    ]);
  });

  it('rejects a column that references a template the board does not link', async () => {
    await expect(service.save(BOARD_ID, { columns: [column([MISSING_ID])] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('lists the submissions of every linked template without conditions', async () => {
    await service.listSubmissions(BOARD_ID, PAGINATION);

    expect(submissions.filters).toEqual([
      { templateId: TEMPLATE_A, conditions: [] },
      { templateId: TEMPLATE_B, conditions: [] },
    ]);
  });

  it('throws NotFound for an unknown board', async () => {
    await expect(service.save(MISSING_ID, { columns: [] })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.listSubmissions(MISSING_ID, PAGINATION)).rejects.toBeInstanceOf(NotFoundException);
  });
});
