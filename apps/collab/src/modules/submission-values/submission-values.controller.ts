import { Body, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { UpdateSubmissionValuesDto } from './dto/update-submission-values.dto';
import { SubmissionValuesService } from './submission-values.service';

@Controller('submissions/:submissionId/values')
export class SubmissionValuesController {
  constructor(private readonly submissionValuesService: SubmissionValuesService) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('submissionId', ParseUUIDPipe) submissionId: string,
    @Body() { values }: UpdateSubmissionValuesDto,
  ): Promise<void> {
    return this.submissionValuesService.update(submissionId, values);
  }
}
