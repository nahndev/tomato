import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import { BoardTaskSettings } from '@tomato/protocol';
import type { PaginatedResponse, PaginationQueryDto } from '../../../common';
import { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
import { BoardTaskRepository } from './board-task.repository';
import type { SaveBoardTaskDto } from './dto/save-board-task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import { SubmissionValuesClient } from './submission-values.client';

@Injectable()
export class BoardTaskService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly repository: BoardTaskRepository,
    private readonly submissionsService: SubmissionsService,
    private readonly submissionValuesClient: SubmissionValuesClient,
  ) {}

  async save(boardId: string, dto: SaveBoardTaskDto): Promise<BoardEntity> {
    const board = await this.boardsService.get(boardId);
    const linkedIds = new Set(board.templates.map((link) => link.templateId));
    const settingIds = dto.setting.map((setting) => setting.templateId);
    if (new Set(settingIds).size !== settingIds.length || settingIds.some((id) => !linkedIds.has(id))) {
      throw new BadRequestException({ details: { setting: [ErrorCode.VALIDATION_FAILED] } });
    }
    await this.repository.save(boardId, dto.setting);
    return this.boardsService.get(boardId);
  }

  async getViewSubmissions(boardId: string, pagination: PaginationQueryDto): Promise<PaginatedResponse<SubmissionEntity>> {
    const { templates, taskSetting } = await this.boardsService.get(boardId);
    const filters = templates.map(({ templateId }) => ({ templateId, conditions: BoardTaskSettings.conditionsOf(taskSetting, templateId) }));
    return this.submissionsService.list(filters, pagination);
  }

  async updateTask(boardId: string, submissionId: string, dto: UpdateTaskDto): Promise<void> {
    const [board, submission] = await Promise.all([
      this.boardsService.get(boardId),
      this.submissionsService.get(submissionId),
    ]);
    const { templateId } = submission.templateVersion;
    if (!board.templates.some((link) => link.templateId === templateId)) throw new NotFoundException();

    const values = BoardTaskSettings.valuesOf(board.taskSetting[templateId], dto);
    if (Object.keys(values).length === 0) return;

    await this.submissionValuesClient.update(submissionId, values);
  }
}
