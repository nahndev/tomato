import { describe, expect, it } from 'vitest';
import {
  COLLISION_THRESHOLD,
  COLUMN_WIDTH,
  GRID_COLUMNS,
} from './grid.constants';
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

  it('snaps to a custom column width', () => {
    expect(getColumn(rect(130, 0, 120, 10), 60)).toBe(2);
    expect(getSpan(rect(130, 0, 120, 10), 60)).toBe(2);
    expect(getResizeSpan(rect(0, 0, 170, 10), 60)).toBe(3);
  });
});

describe('AbsoluteLayoutUtils', () => {
  it('measures the overlap ratio per axis', () => {
    expect(
      AbsoluteLayoutUtils.collisionRatio(
        rect(0, 0, 100, 100),
        rect(50, 80, 100, 100),
      ),
    ).toEqual({ x: 0.5, y: 0.2 });
    expect(
      AbsoluteLayoutUtils.collisionRatio(
        rect(0, 0, 100, 100),
        rect(100, 0, 100, 100),
      ),
    ).toEqual({ x: 0, y: 1 });
    expect(
      AbsoluteLayoutUtils.collisionRatio(
        rect(0, 0, 800, 100),
        rect(100, 50, 100, 400),
      ),
    ).toEqual({ x: 1, y: 0.5 });
    expect(
      AbsoluteLayoutUtils.collisionRatio(
        rect(0, 0, 100, 0),
        rect(0, 0, 100, 100),
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('collides only when both axes pass the threshold', () => {
    const base = rect(0, 0, 100, 100);
    const offset = 100 * (1 - COLLISION_THRESHOLD);
    expect(
      AbsoluteLayoutUtils.isColliding(base, rect(0, offset - 1, 100, 100)),
    ).toBe(true);
    expect(
      AbsoluteLayoutUtils.isColliding(base, rect(0, offset + 1, 100, 100)),
    ).toBe(false);
    expect(
      AbsoluteLayoutUtils.isColliding(base, rect(offset + 1, 0, 100, 100)),
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

  it('scales a layout to a custom column width', () => {
    const layout = AbsoluteLayoutUtils.fromGridLayout(
      'a',
      { column: 2, span: 3, idx: 'a0' },
      40,
      60,
    );
    expect(layout).toMatchObject({ left: 120, width: 180 });
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

  it('skips successors sharing the anchor idx', () => {
    const duplicated = {
      a: { column: 0, span: 1, idx: 'a0' },
      b: { column: 0, span: 1, idx: 'a0' },
      c: { column: 0, span: 1, idx: 'a1' },
    };
    const idx = LayoutIdx.getInsertIdx(duplicated, { id: 'a' });
    expect(idx > 'a0' && idx < 'a1').toBe(true);
  });

  it('appends when every idx is the same', () => {
    const duplicated = {
      a: { column: 0, span: 1, idx: 'a0' },
      b: { column: 0, span: 1, idx: 'a0' },
    };
    expect(LayoutIdx.getInsertIdx(duplicated, { id: 'a' }) > 'a0').toBe(true);
  });

  it('appends when the anchor is unknown', () => {
    expect(LayoutIdx.getInsertIdx(layouts, { id: 'missing' }) > 'a1').toBe(true);
  });
});
