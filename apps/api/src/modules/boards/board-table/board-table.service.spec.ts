import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DisplayType, ValueType } from '@tomato/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PaginationQueryDto } from '../../../common';
import type { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionFilter } from '../../submissions/submissions.types';
import type { BoardsService } from '../boards.service';
import type { BoardColumn, BoardEntity } from '../boards.types';
import type { BoardTableRepository } from './board-table.repository';
import { BoardTableService } from './board-table.service';

const BOARD_ID = '0c9a7e3d-2b41-4f6a-8d5e-9f1b2c3d4e5a';
const TEMPLATE_A = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';
const PAGINATION: PaginationQueryDto = { page: 1, pageSize: 20 };

const column = (templateIds: string[]): BoardColumn => ({
  id: crypto.randomUUID(),
  type: DisplayType.TEXT,
  size: { flex: 1 },
  label: 'Name',
  items: Object.fromEntries(templateIds.map((id) => [id, { widgetId: 'w1', property: ValueType.DEFAULT }])),
});

function makeBoard(): BoardEntity {
  const now = new Date();
  return {
    id: BOARD_ID,
    name: 'Leads',
    createdAt: now,
    updatedAt: now,
    templates: [{ boardId: BOARD_ID, templateId: TEMPLATE_A } as BoardEntity['templates'][number]],
    table: null,
    agenda: null,
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
  constructor(private readonly boards: FakeBoards) {}

  async save(boardId: string, columns: BoardColumn[]) {
    const now = new Date();
    this.boards.board = { ...this.boards.board, table: { boardId, columns, createdAt: now, updatedAt: now } };
  }
  async remove() {
    this.boards.board = { ...this.boards.board, table: null };
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
  let boards: FakeBoards;
  let submissions: FakeSubmissions;

  beforeEach(() => {
    boards = new FakeBoards();
    submissions = new FakeSubmissions();
    service = new BoardTableService(
      boards as unknown as BoardsService,
      new FakeRepository(boards) as unknown as BoardTableRepository,
      submissions as unknown as SubmissionsService,
    );
  });

  it('saves the table columns', async () => {
    const board = await service.save(BOARD_ID, { columns: [column([TEMPLATE_A])] });

    expect(board.table?.columns).toHaveLength(1);
  });

  it('rejects a column that references a template the board does not link', async () => {
    await expect(service.save(BOARD_ID, { columns: [column([MISSING_ID])] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('lists the submissions of every linked template without conditions', async () => {
    await service.save(BOARD_ID, { columns: [] });

    await service.listSubmissions(BOARD_ID, PAGINATION);

    expect(submissions.filters).toEqual([{ templateId: TEMPLATE_A, conditions: [] }]);
  });

  it('throws NotFound when listing the submissions of a board without a table view', async () => {
    await expect(service.listSubmissions(BOARD_ID, PAGINATION)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes the table view', async () => {
    await service.save(BOARD_ID, { columns: [] });

    await service.remove(BOARD_ID);

    expect(boards.board.table).toBeNull();
  });

  it('throws NotFound for an unknown board', async () => {
    await expect(service.save(MISSING_ID, { columns: [] })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });
});
