import { describe, expect, it } from 'vitest';
import { BoardTableSettings } from './board-table-setting';

const ITEM = { widgetId: 'w1' };
const column = (templateIds: string[]) => ({
  id: 'c1',
  items: Object.fromEntries(templateIds.map((id) => [id, ITEM])),
});

describe('BoardTableSettings', () => {
  it('tells whether every column item references one of the given templates', () => {
    const setting = [column(['t1', 't2'])];

    expect(BoardTableSettings.referencesOnly(setting, new Set(['t1', 't2']))).toBe(true);
    expect(BoardTableSettings.referencesOnly(setting, new Set(['t1']))).toBe(false);
    expect(BoardTableSettings.referencesOnly([], new Set())).toBe(true);
  });

  it('keeps only the column items of the given templates', () => {
    const setting = [column(['t1', 't2'])];

    expect(BoardTableSettings.pick(setting, new Set(['t1']))).toEqual([{ id: 'c1', items: { t1: ITEM } }]);
    expect(setting).toEqual([column(['t1', 't2'])]);
  });
});
