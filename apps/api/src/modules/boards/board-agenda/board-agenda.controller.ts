import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam, type PaginatedResponse, PaginationQueryDto } from '../../../common';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import type { BoardEntity } from '../boards.types';
import { BoardAgendaService } from './board-agenda.service';

@ApiTags('boards')
@Controller('boards/:id/views/agenda')
export class BoardAgendaController {
  constructor(private readonly boardAgendaService: BoardAgendaService) {}

  @Put()
  @ApiOperation({ summary: 'Add the agenda view to a board' })
  @ApiUuidParam()
  add(@Param('id', ParseUUIDPipe) id: string): Promise<BoardEntity> {
    return this.boardAgendaService.add(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove the agenda view from a board' })
  @ApiUuidParam()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.boardAgendaService.remove(id);
  }

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
