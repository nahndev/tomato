import { Body, Controller, Get, Param, ParseUUIDPipe, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam, type PaginatedResponse, PaginationQueryDto } from '../../../common';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import type { BoardEntity } from '../boards.types';
import { BoardTableService } from './board-table.service';
import { SaveBoardTableDto } from './dto/save-board-table.dto';

@ApiTags('boards')
@Controller('boards/:id/views/table')
export class BoardTableController {
  constructor(private readonly boardTableService: BoardTableService) {}

  @Put()
  @ApiOperation({ summary: 'Save the table view setting of a board' })
  @ApiUuidParam()
  save(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SaveBoardTableDto): Promise<BoardEntity> {
    return this.boardTableService.save(id, dto);
  }

  @Get('submissions')
  @ApiOperation({ summary: 'List the submissions of the templates linked to a board for its table view' })
  @ApiUuidParam()
  getViewSubmissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<SubmissionEntity>> {
    return this.boardTableService.getViewSubmissions(id, query);
  }
}
