import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
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
    if (dto.columns.some((column) => Object.keys(column.items).some((id) => !templateIds.has(id)))) {
      throw new BadRequestException({ details: { columns: [ErrorCode.VALIDATION_FAILED] } });
    }
    const columns = dto.columns.map(({ id, type, size, label }) => ({ id, type, size, label }));
    const settings = board.templates
      .map(({ templateId }) => ({
        templateId,
        items: Object.fromEntries(
          dto.columns.flatMap((column) => (column.items[templateId] ? [[column.id, column.items[templateId]]] : [])),
        ),
      }))
      .filter(({ items }) => Object.keys(items).length > 0);
    await this.repository.save(boardId, columns, settings);
    return this.boardsService.get(boardId);
  }

  async listSubmissions(boardId: string, pagination: PaginationQueryDto): Promise<PaginatedResponse<SubmissionEntity>> {
    const { templates } = await this.boardsService.get(boardId);
    return this.submissionsService.list(
      templates.map(({ templateId }) => ({ templateId, conditions: [] })),
      pagination,
    );
  }
}
