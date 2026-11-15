import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import type { PaginatedResponse } from '../../../common';
import { SubmissionsService } from '../../submissions/submissions.service';
import type { SubmissionEntity, SubmissionFilter } from '../../submissions/submissions.types';
import { BoardsService } from '../boards.service';
import type { BoardEntity } from '../boards.types';
import { BoardAgendaRepository } from './board-agenda.repository';
import type { AgendaSubmissionsQueryDto } from './dto/agenda-submissions-query.dto';
import type { SaveBoardAgendaDto } from './dto/save-board-agenda.dto';

@Injectable()
export class BoardAgendaService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly repository: BoardAgendaRepository,
    private readonly submissionsService: SubmissionsService,
  ) {}

  async save(boardId: string, dto: SaveBoardAgendaDto): Promise<BoardEntity> {
    const board = await this.boardsService.get(boardId);
    const linkedIds = new Set(board.templates.map((link) => link.templateId));
    const settingIds = dto.setting.map((setting) => setting.templateId);
    if (new Set(settingIds).size !== settingIds.length || settingIds.some((id) => !linkedIds.has(id))) {
      throw new BadRequestException({ details: { setting: [ErrorCode.VALIDATION_FAILED] } });
    }
    await this.repository.save(boardId, dto.setting);
    return this.boardsService.get(boardId);
  }

  async getViewSubmissions(
    boardId: string,
    { from, to, ...pagination }: AgendaSubmissionsQueryDto,
  ): Promise<PaginatedResponse<SubmissionEntity>> {
    const { templates, agendaSetting } = await this.boardsService.get(boardId);
    if (Object.keys(agendaSetting).length === 0) throw new NotFoundException();
    if (to <= from) throw new BadRequestException({ details: { to: [ErrorCode.VALIDATION_FAILED] } });
    const filters = templates.flatMap(({ templateId }): SubmissionFilter[] => {
      const setting = agendaSetting[templateId];
      if (!setting) return [];
      const { startWidget, endWidget } = setting;
      return [{ templateId, conditions: [], range: { startWidget, endWidget, from, to } }];
    });
    return this.submissionsService.list(filters, pagination);
  }
}
