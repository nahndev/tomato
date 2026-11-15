import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PaginationQueryDto } from '../../../common';
import type { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionFilter } from '../../submissions/submissions.types';
import type { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
import type { BoardAgendaRepository } from './board-agenda.repository';
import { BoardAgendaService } from './board-agenda.service';

const BOARD_ID = '0c9a7e3d-2b41-4f6a-8d5e-9f1b2c3d4e5a';
const TEMPLATE_A = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';
const PAGINATION: PaginationQueryDto = { page: 1, pageSize: 20 };

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

  async add(boardId: string) {
    const now = new Date();
    this.boards.board = { ...this.boards.board, agenda: { boardId, createdAt: now, updatedAt: now } };
  }
  async remove() {
    this.boards.board = { ...this.boards.board, agenda: null };
  }
}

class FakeSubmissions {
  filters: SubmissionFilter[] | null = null;

  async list(filters: SubmissionFilter[], { page, pageSize }: PaginationQueryDto) {
    this.filters = filters;
    return { items: [], total: 0, page, pageSize };
  }
}

describe('BoardAgendaService', () => {
  let service: BoardAgendaService;
  let boards: FakeBoards;
  let submissions: FakeSubmissions;

  beforeEach(() => {
    boards = new FakeBoards();
    submissions = new FakeSubmissions();
    service = new BoardAgendaService(
      boards as unknown as BoardsService,
      new FakeRepository(boards) as unknown as BoardAgendaRepository,
      submissions as unknown as SubmissionsService,
    );
  });

  it('adds and removes the agenda view', async () => {
    const board = await service.add(BOARD_ID);
    expect(board.agenda).not.toBeNull();

    await service.remove(BOARD_ID);

    expect(boards.board.agenda).toBeNull();
  });

  it('lists the submissions of every linked template without conditions', async () => {
    await service.add(BOARD_ID);

    await service.listSubmissions(BOARD_ID, PAGINATION);

    expect(submissions.filters).toEqual([{ templateId: TEMPLATE_A, conditions: [] }]);
  });

  it('throws NotFound when listing the submissions of a board without an agenda view', async () => {
    await expect(service.listSubmissions(BOARD_ID, PAGINATION)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws NotFound for an unknown board', async () => {
    await expect(service.add(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(MISSING_ID)).rejects.toBeInstanceOf(NotFoundException);
  });
});
