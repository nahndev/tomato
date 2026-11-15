import { Injectable } from '@nestjs/common';
import type { PaginatedResponse, PaginationQueryDto } from '../../../common';
import { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import { BoardsService } from '../boards.service';

@Injectable()
export class BoardAgendaService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  async listSubmissions(boardId: string, pagination: PaginationQueryDto): Promise<PaginatedResponse<SubmissionEntity>> {
    const { templates } = await this.boardsService.get(boardId);
    return this.submissionsService.list(
      templates.map(({ templateId }) => ({ templateId, conditions: [] })),
      pagination,
    );
  }
}
