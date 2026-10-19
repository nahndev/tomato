import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateBoardDto } from './create-board.dto';

const TEMPLATE_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const COLUMN_ID = '7d1e9a52-0c3b-4f48-8a6e-2b5c9d4e1f70';

const column = (overrides: object = {}) => ({
  id: COLUMN_ID,
  type: 'text',
  size: { flex: 1 },
  label: 'Name',
  items: { [TEMPLATE_ID]: { widgetId: 'w1', property: 'default' } },
  ...overrides,
});

const check = async (plain: object) => validate(plainToInstance(CreateBoardDto, plain));

describe('CreateBoardDto', () => {
  it('accepts a name only', async () => {
    expect(await check({ name: 'Leads' })).toHaveLength(0);
  });

  it('accepts a valid column and version list', async () => {
    expect(await check({ name: 'Leads', templateIds: [TEMPLATE_ID], columns: [column()] })).toHaveLength(0);
  });

  it('rejects a blank name and duplicate template ids', async () => {
    expect(await check({ name: '  ' })).not.toHaveLength(0);
    expect(await check({ name: 'A', templateIds: [TEMPLATE_ID, TEMPLATE_ID] })).not.toHaveLength(0);
  });

  it.each([
    ['both size kinds', { size: { flex: 1, width: 100 } }],
    ['a non-positive size', { size: { width: 0 } }],
    ['an unknown display type', { type: 'chart' }],
    ['a blank label', { label: ' ' }],
    ['a non-uuid item key', { items: { abc: { widgetId: 'w1', property: 'default' } } }],
    ['an unknown value property', { items: { [TEMPLATE_ID]: { widgetId: 'w1', property: 'year' } } }],
    ['an extra item field', { items: { [TEMPLATE_ID]: { widgetId: 'w1', property: 'default', extra: 1 } } }],
  ])('rejects a column with %s', async (_, overrides) => {
    expect(await check({ name: 'A', columns: [column(overrides)] })).not.toHaveLength(0);
  });
});
