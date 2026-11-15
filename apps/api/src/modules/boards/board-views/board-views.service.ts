import { BadRequestException, Injectable } from '@nestjs/common';
import { type BoardView, ErrorCode } from '@tomato/constants';
import { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
import { BoardViewsRepository } from './board-views.repository';
import type { SaveBoardTableDto } from './dto/save-board-table.dto';

@Injectable()
export class BoardViewsService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly repository: BoardViewsRepository,
  ) {}

  async saveTable(boardId: string, dto: SaveBoardTableDto): Promise<BoardEntity> {
    const board = await this.boardsService.get(boardId);
    const templateIds = new Set(board.templates.map((link) => link.templateId));
    if (dto.columns.some((column) => Object.keys(column.items).some((id) => !templateIds.has(id)))) {
      throw new BadRequestException({ details: { columns: [ErrorCode.VALIDATION_FAILED] } });
    }
    await this.repository.saveTable(boardId, dto.columns);
    return this.boardsService.get(boardId);
  }

  async add(boardId: string, view: typeof BoardView.TASK | typeof BoardView.AGENDA): Promise<BoardEntity> {
    await this.boardsService.get(boardId);
    await this.repository.add(boardId, view);
    return this.boardsService.get(boardId);
  }

  async remove(boardId: string, view: BoardView): Promise<void> {
    await this.boardsService.get(boardId);
    await this.repository.remove(boardId, view);
  }
}
