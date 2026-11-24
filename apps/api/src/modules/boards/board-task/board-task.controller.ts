import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam, type PaginatedResponse, PaginationQueryDto } from '../../../common';
import type { SubmissionEntity } from '../../submissions/submissions.types';
import type { BoardEntity } from '../boards.types';
import { BoardTaskService } from './board-task.service';
import { SaveBoardTaskDto } from './dto/save-board-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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

  @Patch('submissions/:submissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update the task view fields of a submission' })
  @ApiUuidParam()
  @ApiUuidParam('submissionId')
  updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('submissionId', ParseUUIDPipe) submissionId: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<void> {
    return this.boardTaskService.updateTask(id, submissionId, dto);
  }
}
