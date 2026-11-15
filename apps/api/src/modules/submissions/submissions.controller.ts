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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam } from '../../common';
import { ApplyValuesDto } from './dto/apply-values.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionsService } from './submissions.service';
import type { SubmissionDetailEntity, SubmissionEntity } from './submissions.types';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a submission with its template version' })
  @ApiUuidParam()
  get(@Param('id', ParseUUIDPipe) id: string): Promise<SubmissionDetailEntity> {
    return this.submissionsService.get(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a submission from the newest published version of a template' })
  create(@Body() dto: CreateSubmissionDto): Promise<SubmissionEntity> {
    return this.submissionsService.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a submission' })
  @ApiUuidParam()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.submissionsService.remove(id);
  }

  @Put(':id/values')
  @ApiOperation({ summary: 'Sync the live values and meta of a submission (called by the collab server)' })
  @ApiUuidParam()
  @HttpCode(HttpStatus.NO_CONTENT)
  applyValues(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ApplyValuesDto): Promise<void> {
    return this.submissionsService.applyChanges(id, dto.values, dto.meta);
  }
}
