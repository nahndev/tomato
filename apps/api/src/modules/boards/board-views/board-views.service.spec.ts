import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BoardView, DisplayType, ValueType } from '@tomato/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import type { BoardsService } from '../boards.service';
import type { BoardColumn, BoardEntity } from '../boards.types';
import type { BoardViewsRepository } from './board-views.repository';
import { BoardViewsService } from './board-views.service';

const BOARD_ID = '0c9a7e3d-2b41-4f6a-8d5e-9f1b2c3d4e5a';
const TEMPLATE_A = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const TEMPLATE_B = '7d1e9a52-0c3b-4f48-8a6e-2b5c9d4e1f70';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';

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
    table: { boardId: BOARD_ID, columns: [], createdAt: now, updatedAt: now },
    task: null,
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

  async saveTable(boardId: string, columns: BoardColumn[]) {
    const now = new Date();
    this.boards.board = { ...this.boards.board, table: { boardId, columns, createdAt: now, updatedAt: now } };
  }
  async add(boardId: string, view: BoardView) {
    const now = new Date();
    this.boards.board = { ...this.boards.board, [view]: { boardId, createdAt: now, updatedAt: now } };
  }
  async remove(_boardId: string, view: BoardView) {
    this.boards.board = { ...this.boards.board, [view]: null };
  }
}

describe('BoardViewsService', () => {
  let service: BoardViewsService;

  beforeEach(() => {
    const boards = new FakeBoards();
    service = new BoardViewsService(
      boards as unknown as BoardsService,
      new FakeRepository(boards) as unknown as BoardViewsRepository,
    );
  });

  it('saves the table columns', async () => {
    const board = await service.saveTable(BOARD_ID, { columns: [column([TEMPLATE_A])] });

    expect(board.table?.columns).toHaveLength(1);
  });

  it('rejects a column that references a template the board does not link', async () => {
    await expect(service.saveTable(BOARD_ID, { columns: [column([TEMPLATE_B])] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('adds and removes views', async () => {
    const withTask = await service.add(BOARD_ID, BoardView.TASK);
    expect(withTask.task).not.toBeNull();

    await service.remove(BOARD_ID, BoardView.TABLE);
    const withAgenda = await service.add(BOARD_ID, BoardView.AGENDA);
    expect(withAgenda.table).toBeNull();
    expect(withAgenda.task).not.toBeNull();
    expect(withAgenda.agenda).not.toBeNull();
  });

  it('throws NotFound for an unknown board', async () => {
    await expect(service.saveTable(MISSING_ID, { columns: [] })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.add(MISSING_ID, BoardView.AGENDA)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(MISSING_ID, BoardView.TABLE)).rejects.toBeInstanceOf(NotFoundException);
  });
});
