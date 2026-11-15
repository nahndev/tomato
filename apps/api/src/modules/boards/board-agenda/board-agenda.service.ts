import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginatedResponse, PaginationQueryDto } from '../../../common';
import { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
import { BoardAgendaRepository } from './board-agenda.repository';

@Injectable()
export class BoardAgendaService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly repository: BoardAgendaRepository,
    private readonly submissionsService: SubmissionsService,
  ) {}

  async add(boardId: string): Promise<BoardEntity> {
    await this.boardsService.get(boardId);
    await this.repository.add(boardId);
    return this.boardsService.get(boardId);
  }

  async getViewSubmissions(boardId: string, pagination: PaginationQueryDto): Promise<PaginatedResponse<SubmissionEntity>> {
    const { templates, agenda } = await this.boardsService.get(boardId);
    if (!agenda) throw new NotFoundException();
    return this.submissionsService.list(
      templates.map(({ templateId }) => ({ templateId, conditions: [] })),
      pagination,
    );
  }

  async remove(boardId: string): Promise<void> {
    await this.boardsService.get(boardId);
    await this.repository.remove(boardId);
  }
}
