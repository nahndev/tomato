import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
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
    const settingIds = dto.settings.map((setting) => setting.templateId);
    if (new Set(settingIds).size !== settingIds.length || settingIds.some((id) => !linkedIds.has(id))) {
      throw new BadRequestException({ details: { settings: [ErrorCode.VALIDATION_FAILED] } });
    }
    await this.repository.save(boardId, dto.settings);
    return this.boardsService.get(boardId);
  }

  async remove(boardId: string): Promise<void> {
    await this.boardsService.get(boardId);
    await this.repository.remove(boardId);
  }

  async listSubmissions(boardId: string, pagination: PaginationQueryDto): Promise<PaginatedResponse<SubmissionEntity>> {
    const { templates, task } = await this.boardsService.get(boardId);
    if (!task) throw new NotFoundException();
    const conditionsByTemplate = new Map(task.settings.map((setting) => [setting.templateId, setting.conditions]));
    return this.submissionsService.list(
      templates.map(({ templateId }) => ({ templateId, conditions: conditionsByTemplate.get(templateId) ?? [] })),
      pagination,
    );
  }
}
