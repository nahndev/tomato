import { ApiProperty } from '@nestjs/swagger';
import { TaskConditionOperation } from '@tomato/constants';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';

export class BoardTaskConditionDto {
  @ApiProperty({ description: 'Option widget id' })
  @IsString()
  @MinLength(1)
  widget!: string;

  @ApiProperty({ enum: Object.values(TaskConditionOperation) })
  @IsIn(Object.values(TaskConditionOperation))
  operation!: TaskConditionOperation;

  @ApiProperty({ description: 'Option key' })
  @IsString()
  @MinLength(1)
  value!: string;
}

export class BoardTaskSettingDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  templateId!: string;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  typeWidget?: string | null;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  titleWidget?: string | null;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  statusWidget?: string | null;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  assigneeWidget?: string | null;

  @ApiProperty({ type: [BoardTaskConditionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardTaskConditionDto)
  conditions!: BoardTaskConditionDto[];
}
