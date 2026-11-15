import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { AgendaSubmissionsQueryDto } from './agenda-submissions-query.dto';

const checkQuery = async (plain: object) => validate(plainToInstance(AgendaSubmissionsQueryDto, plain));

describe('AgendaSubmissionsQueryDto', () => {
  it('accepts a range given as query strings', async () => {
    expect(await checkQuery({ from: '1763337600000', to: '1763942400000' })).toHaveLength(0);
  });

  it.each([
    ['a missing range', {}],
    ['a missing end', { from: '0' }],
    ['a negative start', { from: '-1', to: '10' }],
    ['a non-numeric end', { from: '0', to: 'soon' }],
  ])('rejects %s', async (_, plain) => {
    expect(await checkQuery(plain)).not.toHaveLength(0);
  });
});
