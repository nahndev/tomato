import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import { JsonBoardTable } from '@tomato/utils';
import type { PaginatedResponse, PaginationQueryDto } from '../../../common';
import { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
import { BoardTableRepository } from './board-table.repository';
import type { SaveBoardTableDto } from './dto/save-board-table.dto';

@Injectable()
export class BoardTableService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly repository: BoardTableRepository,
    private readonly submissionsService: SubmissionsService,
  ) {}

  async save(boardId: string, dto: SaveBoardTableDto): Promise<BoardEntity> {
    const board = await this.boardsService.get(boardId);
    const templateIds = new Set(board.templates.map((link) => link.templateId));
    if (!new JsonBoardTable(dto.setting).referencesOnly(templateIds)) {
      throw new BadRequestException({ details: { setting: [ErrorCode.VALIDATION_FAILED] } });
    }
    await this.repository.save(boardId, dto.setting);
    return this.boardsService.get(boardId);
  }

  async getViewSubmissions(boardId: string, pagination: PaginationQueryDto): Promise<PaginatedResponse<SubmissionEntity>> {
    const { templates, tableSetting } = await this.boardsService.get(boardId);
    if (tableSetting.length === 0) throw new NotFoundException();
    return this.submissionsService.list(
      templates.map(({ templateId }) => ({ templateId, conditions: [] })),
      pagination,
    );
  }
}
