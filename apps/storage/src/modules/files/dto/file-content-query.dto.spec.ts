import { BadRequestException } from '@nestjs/common';
import { ImageVariant } from '@tomato/constants';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../../common';
import { FileContentQueryDto } from './file-content-query.dto';

function parse(query: Record<string, unknown>): Promise<FileContentQueryDto> {
  return createValidationPipe().transform(query, {
    type: 'query',
    metatype: FileContentQueryDto,
  }) as Promise<FileContentQueryDto>;
}

describe('FileContentQueryDto', () => {
  it.each([[{}], [{ variant: ImageVariant.SMALL }], [{ variant: ImageVariant.MEDIUM }]])('accepts %j', async (query) => {
    await expect(parse(query)).resolves.toMatchObject(query);
  });

  it('rejects an unknown variant', async () => {
    await expect(parse({ variant: 'huge' })).rejects.toBeInstanceOf(BadRequestException);
  });
});
