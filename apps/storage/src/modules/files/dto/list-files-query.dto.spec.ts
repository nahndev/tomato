import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../../common';
import { FILES_MAX_IDS } from '../files.constants';
import { ListFilesQueryDto } from './list-files-query.dto';

const FIRST = '0190f3a0-0000-7000-8000-000000000001';
const SECOND = '0190f3a0-0000-7000-8000-000000000002';

function parse(query: Record<string, unknown>): Promise<ListFilesQueryDto> {
  return createValidationPipe().transform(query, {
    type: 'query',
    metatype: ListFilesQueryDto,
  }) as Promise<ListFilesQueryDto>;
}

describe('ListFilesQueryDto', () => {
  it('splits comma-separated ids', async () => {
    await expect(parse({ ids: `${FIRST}, ${SECOND}` })).resolves.toMatchObject({ ids: [FIRST, SECOND] });
  });

  it('accepts repeated ids', async () => {
    await expect(parse({ ids: [FIRST, SECOND] })).resolves.toMatchObject({ ids: [FIRST, SECOND] });
  });

  it('treats an empty value as no ids', async () => {
    await expect(parse({ ids: '' })).resolves.toMatchObject({ ids: [] });
  });

  it.each([
    ['a missing value', {}],
    ['an id that is not a uuid', { ids: `${FIRST},nope` }],
    ['too many ids', { ids: Array.from({ length: FILES_MAX_IDS + 1 }, () => FIRST).join(',') }],
  ])('rejects %s', async (_, query) => {
    await expect(parse(query)).rejects.toBeInstanceOf(BadRequestException);
  });
});
