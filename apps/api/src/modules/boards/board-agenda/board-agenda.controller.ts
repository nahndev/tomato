import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam, type PaginatedResponse, PaginationQueryDto } from '../../../common';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import { BoardAgendaService } from './board-agenda.service';

@ApiTags('boards')
@Controller('boards/:id/views/agenda')
export class BoardAgendaController {
  constructor(private readonly boardAgendaService: BoardAgendaService) {}

  @Get('submissions')
  @ApiOperation({ summary: 'List the submissions of the templates linked to a board for its agenda view' })
  @ApiUuidParam()
  getViewSubmissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<SubmissionEntity>> {
    return this.boardAgendaService.getViewSubmissions(id, query);
  }
}
