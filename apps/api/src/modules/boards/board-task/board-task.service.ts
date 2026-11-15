import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import { JsonBoardTask } from '@tomato/utils';
import type { PaginatedResponse, PaginationQueryDto } from '../../../common';
import { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
import { BoardTaskRepository } from './board-task.repository';
import type { SaveBoardTaskDto } from './dto/save-board-task.dto';

@Injectable()
export class BoardTaskService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly repository: BoardTaskRepository,
    private readonly submissionsService: SubmissionsService,
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
    const json = new JsonBoardTask(taskSetting);
    const filters = templates.map(({ templateId }) => ({ templateId, conditions: json.conditionsOf(templateId) }));
    return this.submissionsService.list(filters, pagination);
  }
}
