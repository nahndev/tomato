import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { SaveBoardTableDto } from './save-board-table.dto';

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

const checkTable = async (plain: object) => validate(plainToInstance(SaveBoardTableDto, plain));

describe('SaveBoardTableDto', () => {
  it('accepts a valid column', async () => {
    expect(await checkTable({ setting: [column()] })).toHaveLength(0);
  });

  it('requires the setting', async () => {
    expect(await checkTable({})).not.toHaveLength(0);
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
    expect(await checkTable({ setting: [column(overrides)] })).not.toHaveLength(0);
  });
});
