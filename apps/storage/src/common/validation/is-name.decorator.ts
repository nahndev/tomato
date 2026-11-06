import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../common.constants';

export const IsName = () =>
  applyDecorators(IsString(), MinLength(NAME_MIN_LENGTH), MaxLength(NAME_MAX_LENGTH));
