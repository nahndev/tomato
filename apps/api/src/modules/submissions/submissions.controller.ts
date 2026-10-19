import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { PaginatedResponse, Submission, SubmissionDetail } from '@tomato/types';
import { ApplyValuesDto } from './dto/apply-values.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ListSubmissionsQueryDto } from './dto/list-submissions-query.dto';
import { SUBMISSIONS_ROUTE, SUBMISSION_VALUES_PATH } from './submissions.constants';
import { SubmissionsService } from './submissions.service';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('submissions')
@Controller(SUBMISSIONS_ROUTE)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  @ApiOperation({ summary: 'List the submissions of a board' })
  list(@Query() query: ListSubmissionsQueryDto): Promise<PaginatedResponse<Submission>> {
    return this.submissionsService.list(query.boardId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a submission with its template version' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<SubmissionDetail> {
    return this.submissionsService.get(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a submission from a template version linked to a board' })
  create(@Body() dto: CreateSubmissionDto): Promise<Submission> {
    return this.submissionsService.create(dto);
  }

  @Put(`:id/${SUBMISSION_VALUES_PATH}`)
  @ApiOperation({ summary: 'Sync the live values of a submission (called by the collab server)' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  applyValues(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ApplyValuesDto): Promise<void> {
    return this.submissionsService.applyValues(id, dto.values);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a submission' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.submissionsService.remove(id);
  }
}
