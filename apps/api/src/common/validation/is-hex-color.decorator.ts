import { applyDecorators } from '@nestjs/common';
import { toHexColor } from '@tomato/utils';
import { Transform } from 'class-transformer';
import { createValidator } from './create-validator';

const IsParsableColor = createValidator('isHexColor', (value) => toHexColor(value) !== null);

export const IsHexColor = () =>
  applyDecorators(
    Transform(({ value }: { value: unknown }) => toHexColor(value) ?? value),
    IsParsableColor(),
  );
