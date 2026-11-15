import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateBoardDto } from './create-board.dto';

const TEMPLATE_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const check = async (plain: object) => validate(plainToInstance(CreateBoardDto, plain));

describe('CreateBoardDto', () => {
  it('accepts a name only', async () => {
    expect(await check({ name: 'Leads' })).toHaveLength(0);
  });

  it('rejects a blank name and duplicate template ids', async () => {
    expect(await check({ name: '  ' })).not.toHaveLength(0);
    expect(await check({ name: 'A', templateIds: [TEMPLATE_ID, TEMPLATE_ID] })).not.toHaveLength(0);
  });
});
