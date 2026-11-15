import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import type { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionFilter } from '../../submissions/submissions.types';
import type { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
import type { BoardAgendaRepository } from './board-agenda.repository';
import { BoardAgendaService } from './board-agenda.service';
import type { BoardAgendaSettingDto } from './dto/board-agenda-setting.dto';
import type { AgendaSubmissionsQueryDto } from './dto/agenda-submissions-query.dto';

const BOARD_ID = '0c9a7e3d-2b41-4f6a-8d5e-9f1b2c3d4e5a';
const TEMPLATE_A = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const TEMPLATE_B = '7d1e9a52-0c3b-4f48-8a6e-2b5c9d4e1f70';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';
const FROM = 1_763_337_600_000;
const TO = FROM + 7 * 24 * 60 * 60 * 1000;
const QUERY: AgendaSubmissionsQueryDto = { page: 1, pageSize: 20, from: FROM, to: TO };

const agendaSetting = (templateId: string): BoardAgendaSettingDto => ({
  templateId,
  titleWidget: 'w-title',
  startWidget: 'w-start',
  endWidget: 'w-end',
});

function makeBoard(): BoardEntity {
  const now = new Date();
  return {
    id: BOARD_ID,
    name: 'Leads',
    createdAt: now,
    updatedAt: now,
    templates: [TEMPLATE_A, TEMPLATE_B].map(
      (templateId) => ({ boardId: BOARD_ID, templateId }) as BoardEntity['templates'][number],
    ),
    tableSetting: [],
    taskSetting: {},
    agendaSetting: {},
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

  async save(_boardId: string, setting: BoardAgendaSettingDto[]) {
    this.boards.board = {
      ...this.boards.board,
      agendaSetting: Object.fromEntries(
        setting.map(({ templateId, titleWidget, startWidget, endWidget }) => [
          templateId,
          { titleWidget: titleWidget ?? null, startWidget, endWidget: endWidget ?? null },
        ]),
      ),
    };
  }
}

class FakeSubmissions {
  filters: SubmissionFilter[] | null = null;
  pagination: { page: number; pageSize: number } | null = null;

  async list(filters: SubmissionFilter[], pagination: { page: number; pageSize: number }) {
    this.filters = filters;
    this.pagination = pagination;
    return { items: [], total: 0, ...pagination };
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

  it('saves the agenda setting', async () => {
    const board = await service.save(BOARD_ID, { setting: [agendaSetting(TEMPLATE_A)] });

    expect(board.agendaSetting).toEqual({
      [TEMPLATE_A]: { titleWidget: 'w-title', startWidget: 'w-start', endWidget: 'w-end' },
    });
  });

  it.each([
    ['a template the board does not link', [agendaSetting(MISSING_ID)]],
    ['a template set twice', [agendaSetting(TEMPLATE_A), agendaSetting(TEMPLATE_A)]],
  ])('rejects an agenda setting with %s', async (_, setting) => {
    await expect(service.save(BOARD_ID, { setting })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists only the templates with a setting, filtered by the range', async () => {
    await service.save(BOARD_ID, { setting: [agendaSetting(TEMPLATE_A)] });

    await service.getViewSubmissions(BOARD_ID, QUERY);

    expect(submissions.filters).toEqual([
      { templateId: TEMPLATE_A, conditions: [], range: { startWidget: 'w-start', endWidget: 'w-end', from: FROM, to: TO } },
    ]);
    expect(submissions.pagination).toEqual({ page: 1, pageSize: 20 });
  });

  it('rejects a range that ends before it starts', async () => {
    await service.save(BOARD_ID, { setting: [agendaSetting(TEMPLATE_A)] });

    await expect(service.getViewSubmissions(BOARD_ID, { ...QUERY, to: FROM })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws NotFound when listing the submissions of a board without an agenda setting', async () => {
    await expect(service.getViewSubmissions(BOARD_ID, QUERY)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws NotFound for an unknown board', async () => {
    await expect(service.save(MISSING_ID, { setting: [] })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.getViewSubmissions(MISSING_ID, QUERY)).rejects.toBeInstanceOf(NotFoundException);
  });
});
