import { Body, Controller, Get, Param, ParseUUIDPipe, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam, type PaginatedResponse, PaginationQueryDto } from '../../../common';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import type { BoardEntity } from '../boards.types';
import { BoardTaskService } from './board-task.service';
import { SaveBoardTaskDto } from './dto/save-board-task.dto';

@ApiTags('boards')
@Controller('boards/:id/views/task')
export class BoardTaskController {
  constructor(private readonly boardTaskService: BoardTaskService) {}

  @Put()
  @ApiOperation({ summary: 'Save the task view setting of a board' })
  @ApiUuidParam()
  save(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SaveBoardTaskDto): Promise<BoardEntity> {
    return this.boardTaskService.save(id, dto);
  }

  @Get('submissions')
  @ApiOperation({ summary: 'List the submissions of a board that pass the task view conditions' })
  @ApiUuidParam()
  getViewSubmissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<SubmissionEntity>> {
    return this.boardTaskService.getViewSubmissions(id, query);
  }
}
