import { applyDecorators } from '@nestjs/common';
import { normalizeHexColor } from '@tomato/protocol';
import { Transform } from 'class-transformer';
import { createValidator } from './create-validator';

const IsParsableColor = createValidator('isHexColor', (value) => normalizeHexColor(value) !== null);

export const IsHexColor = () =>
  applyDecorators(
    Transform(({ value }: { value: unknown }) => normalizeHexColor(value) ?? value),
    IsParsableColor(),
  );
