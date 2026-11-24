import { IsObject } from 'class-validator';

export class UpdateSubmissionValuesDto {
  @IsObject()
  values!: Record<string, unknown>;
}
