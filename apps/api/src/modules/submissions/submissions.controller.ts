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
import type { PaginatedResponse } from '../../common';
import { ApplyValuesDto } from './dto/apply-values.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ListSubmissionsQueryDto } from './dto/list-submissions-query.dto';
import { SubmissionsService } from './submissions.service';
import type { SubmissionDetailEntity, SubmissionEntity } from './submissions.types';

const ID_PARAM = { name: 'id', format: 'uuid' };

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  @ApiOperation({ summary: 'List the submissions of a board' })
  list(@Query() query: ListSubmissionsQueryDto): Promise<PaginatedResponse<SubmissionEntity>> {
    return this.submissionsService.list(query.boardId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a submission with its template version' })
  @ApiParam(ID_PARAM)
  get(@Param('id', ParseUUIDPipe) id: string): Promise<SubmissionDetailEntity> {
    return this.submissionsService.get(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a submission from a template version linked to a board' })
  create(@Body() dto: CreateSubmissionDto): Promise<SubmissionEntity> {
    return this.submissionsService.create(dto);
  }

  @Put(':id/values')
  @ApiOperation({ summary: 'Sync the live values of a submission (called by the collab server)' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  applyValues(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ApplyValuesDto): Promise<void> {
    return this.submissionsService.applyChanges(id, dto.values);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a submission' })
  @ApiParam(ID_PARAM)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.submissionsService.remove(id);
  }
}
