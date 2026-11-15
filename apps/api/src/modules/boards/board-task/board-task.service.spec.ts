import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TaskConditionOperation } from '@tomato/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PaginationQueryDto } from '../../../common';
import type { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionFilter } from '../../submissions/submissions.types';
import type { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
import type { BoardTaskRepository } from './board-task.repository';
import { BoardTaskService } from './board-task.service';
import type { BoardTaskSettingDto } from './dto/board-task-setting.dto';

const BOARD_ID = '0c9a7e3d-2b41-4f6a-8d5e-9f1b2c3d4e5a';
const TEMPLATE_A = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const TEMPLATE_B = '7d1e9a52-0c3b-4f48-8a6e-2b5c9d4e1f70';
const MISSING_ID = 'a4c8e6b0-91d2-4a3f-b5e7-6f0d1c2b3a49';
const PAGINATION: PaginationQueryDto = { page: 1, pageSize: 20 };
const IS_NOT_DONE = { widget: 'w-status', operation: TaskConditionOperation.IS_NOT, value: 'done' };

const taskSetting = (templateId: string): BoardTaskSettingDto => ({
  templateId,
  statusWidget: 'w-status',
  conditions: [IS_NOT_DONE],
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
    table: null,
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

  async save(boardId: string, settings: BoardTaskSettingDto[]) {
    const now = new Date();
    this.boards.board = {
      ...this.boards.board,
      task: {
        boardId,
        settings: Object.fromEntries(
          settings.map(({ templateId, typeWidget, titleWidget, statusWidget, assigneeWidget, conditions }) => [
            templateId,
            {
              typeWidget: typeWidget ?? null,
              titleWidget: titleWidget ?? null,
              statusWidget: statusWidget ?? null,
              assigneeWidget: assigneeWidget ?? null,
              conditions,
            },
          ]),
        ),
        createdAt: now,
        updatedAt: now,
      },
    };
  }
}

class FakeSubmissions {
  filters: SubmissionFilter[] | null = null;

  async list(filters: SubmissionFilter[], { page, pageSize }: PaginationQueryDto) {
    this.filters = filters;
    return { items: [], total: 0, page, pageSize };
  }
}

describe('BoardTaskService', () => {
  let service: BoardTaskService;
  let boards: FakeBoards;
  let submissions: FakeSubmissions;

  beforeEach(() => {
    boards = new FakeBoards();
    submissions = new FakeSubmissions();
    service = new BoardTaskService(
      boards as unknown as BoardsService,
      new FakeRepository(boards) as unknown as BoardTaskRepository,
      submissions as unknown as SubmissionsService,
    );
  });

  it('saves the task settings', async () => {
    const board = await service.save(BOARD_ID, { settings: [taskSetting(TEMPLATE_A)] });

    expect(Object.keys(board.task?.settings ?? {})).toEqual([TEMPLATE_A]);
  });

  it.each([
    ['a template the board does not link', [taskSetting(MISSING_ID)]],
    ['a template set twice', [taskSetting(TEMPLATE_A), taskSetting(TEMPLATE_A)]],
  ])('rejects task settings with %s', async (_, settings) => {
    await expect(service.save(BOARD_ID, { settings })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists the tasks of every linked template with the conditions of its own setting', async () => {
    await service.save(BOARD_ID, { settings: [taskSetting(TEMPLATE_A)] });

    await service.getViewSubmissions(BOARD_ID, PAGINATION);

    expect(submissions.filters).toEqual([
      { templateId: TEMPLATE_A, conditions: [IS_NOT_DONE] },
      { templateId: TEMPLATE_B, conditions: [] },
    ]);
  });

  it('lists the submissions of every linked template without conditions before any setting is saved', async () => {
    await service.getViewSubmissions(BOARD_ID, PAGINATION);

    expect(submissions.filters).toEqual([
      { templateId: TEMPLATE_A, conditions: [] },
      { templateId: TEMPLATE_B, conditions: [] },
    ]);
  });

  it('throws NotFound for an unknown board', async () => {
    await expect(service.save(MISSING_ID, { settings: [] })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.getViewSubmissions(MISSING_ID, PAGINATION)).rejects.toBeInstanceOf(NotFoundException);
  });
});
