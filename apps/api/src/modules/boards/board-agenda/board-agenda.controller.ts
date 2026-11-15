import { Body, Controller, Get, Param, ParseUUIDPipe, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam, type PaginatedResponse } from '../../../common';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import type { BoardEntity } from '../boards.types';
import { BoardAgendaService } from './board-agenda.service';
import { AgendaSubmissionsQueryDto } from './dto/agenda-submissions-query.dto';
import { SaveBoardAgendaDto } from './dto/save-board-agenda.dto';

@ApiTags('boards')
@Controller('boards/:id/views/agenda')
export class BoardAgendaController {
  constructor(private readonly boardAgendaService: BoardAgendaService) {}

  @Put()
  @ApiOperation({ summary: 'Save the agenda view setting of a board' })
  @ApiUuidParam()
  save(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SaveBoardAgendaDto): Promise<BoardEntity> {
    return this.boardAgendaService.save(id, dto);
  }

  @Get('submissions')
  @ApiOperation({ summary: 'List the submissions of a board whose agenda dates overlap a range' })
  @ApiUuidParam()
  getViewSubmissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: AgendaSubmissionsQueryDto,
  ): Promise<PaginatedResponse<SubmissionEntity>> {
    return this.boardAgendaService.getViewSubmissions(id, query);
  }
}
