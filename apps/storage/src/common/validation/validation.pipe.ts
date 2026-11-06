import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

function collectErrors(errors: ValidationError[], parent = '', out: Record<string, string[]> = {}) {
  for (const { property, constraints, children } of errors) {
    const path = parent ? `${parent}.${property}` : property;
    if (constraints) out[path] = Object.values(constraints);
    if (children?.length) collectErrors(children, path, out);
  }
  return out;
}

export const createValidationPipe = () =>
  new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException({ details: collectErrors(errors) }),
  });
