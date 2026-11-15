import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PaginationQueryDto } from '../../../common';
import type { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionFilter } from '../../submissions/submissions.types';
import type { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
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
    tableColumns: [],
    templates: [
      { boardId: BOARD_ID, templateId: TEMPLATE_A, tableSetting: null, taskSetting: null } as BoardEntity['templates'][number],
    ],
  };
}

class FakeBoards {
  board = makeBoard();

  async get(id: string) {
    if (id !== this.board.id) throw new NotFoundException();
    return this.board;
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
  let submissions: FakeSubmissions;

  beforeEach(() => {
    submissions = new FakeSubmissions();
    service = new BoardAgendaService(new FakeBoards() as unknown as BoardsService, submissions as unknown as SubmissionsService);
  });

  it('lists the submissions of every linked template without conditions', async () => {
    await service.listSubmissions(BOARD_ID, PAGINATION);

    expect(submissions.filters).toEqual([{ templateId: TEMPLATE_A, conditions: [] }]);
  });

  it('throws NotFound for an unknown board', async () => {
    await expect(service.listSubmissions(MISSING_ID, PAGINATION)).rejects.toBeInstanceOf(NotFoundException);
  });
});
