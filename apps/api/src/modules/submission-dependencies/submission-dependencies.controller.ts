import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUuidParam } from '../../common';
import { SubmissionDependenciesService } from './submission-dependencies.service';
import type { SubmissionGraph } from './submission-dependencies.types';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionDependenciesController {
  constructor(private readonly dependenciesService: SubmissionDependenciesService) {}

  @Get(':id/graph')
  @ApiOperation({ summary: 'Get every submission connected to a submission by dependencies, and those dependencies' })
  @ApiUuidParam()
  getGraph(@Param('id', ParseUUIDPipe) id: string): Promise<SubmissionGraph> {
    return this.dependenciesService.getGraph(id);
  }
}
