import { describe, expect, it } from 'vitest';
import { COLUMN_WIDTH, GRID_COLUMNS } from './grid.constants';
import {
  AbsoluteLayoutUtils,
  LayoutIdx,
  getColumn,
  getResizeSpan,
  getSpan,
} from './grid.utils';

const rect = (left: number, top: number, width: number, height: number) => ({
  left,
  top,
  width,
  height,
});

describe('getColumn / getSpan', () => {
  it('snaps to the column grid', () => {
    expect(getColumn(rect(250, 0, 200, 10))).toBe(2);
    expect(getSpan(rect(250, 0, 200, 10))).toBe(2);
  });

  it('clamps inside the grid', () => {
    const layout = rect(10_000, 0, COLUMN_WIDTH * 3, 10);
    expect(getColumn(layout)).toBe(GRID_COLUMNS - 3);
    expect(getResizeSpan(rect(700, 0, COLUMN_WIDTH * 5, 10))).toBe(1);
  });
});

describe('AbsoluteLayoutUtils', () => {
  it('detects overlap', () => {
    expect(
      AbsoluteLayoutUtils.collision(rect(0, 0, 100, 100), rect(50, 50, 100, 100)),
    ).toBe(true);
    expect(
      AbsoluteLayoutUtils.collision(rect(0, 0, 100, 100), rect(100, 0, 100, 100)),
    ).toBe(false);
  });

  it('expands full-width layouts to the whole grid', () => {
    const layout = AbsoluteLayoutUtils.fromGridLayout(
      'a',
      { column: 3, span: 1, idx: 'a0', isFullWidth: true },
      40,
    );
    expect(layout).toMatchObject({
      left: 0,
      width: GRID_COLUMNS * COLUMN_WIDTH,
      height: 40,
    });
  });
});

describe('LayoutIdx.getInsertIdx', () => {
  const layouts = {
    a: { column: 0, span: 1, idx: 'a0' },
    b: { column: 0, span: 1, idx: 'a1' },
  };

  it('appends when there is no anchor', () => {
    expect(LayoutIdx.getInsertIdx(layouts, null) > 'a1').toBe(true);
  });

  it('inserts between anchor and its successor', () => {
    const idx = LayoutIdx.getInsertIdx(layouts, { id: 'a' });
    expect(idx > 'a0' && idx < 'a1').toBe(true);
  });
});
