import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Option key of the type widget', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiProperty({ description: 'Option key of the status widget', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  status?: string;

  @ApiProperty({ description: 'User ids', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  assignee?: string[];
}
