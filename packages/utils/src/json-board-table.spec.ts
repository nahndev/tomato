import { describe, expect, it } from 'vitest';
import { JsonBoardTable } from './json-board-table';

const ITEM = { widgetId: 'w1' };
const column = (templateIds: string[]) => ({
  id: 'c1',
  items: Object.fromEntries(templateIds.map((id) => [id, ITEM])),
});

describe('JsonBoardTable', () => {
  it('tells whether every column item references one of the given templates', () => {
    const json = new JsonBoardTable([column(['t1', 't2'])]);

    expect(json.referencesOnly(new Set(['t1', 't2']))).toBe(true);
    expect(json.referencesOnly(new Set(['t1']))).toBe(false);
    expect(new JsonBoardTable().referencesOnly(new Set())).toBe(true);
  });

  it('keeps only the column items of the given templates', () => {
    const json = new JsonBoardTable([column(['t1', 't2'])]).pick(new Set(['t1']));

    expect(json.columns).toEqual([{ id: 'c1', items: { t1: ITEM } }]);
  });
});
