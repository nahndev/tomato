import { generateKeyBetween } from "fractional-indexing";
import * as R from "remeda";
import {
  COLLISION_THRESHOLD,
  COLUMN_WIDTH,
  GRID_COLUMNS,
} from "./grid.constants";
import type {
  AbsoluteLayout,
  CollisionRatio,
  GridLayoutRect,
  LayoutRect,
} from "./grid.types";

export class LayoutIdx {
  // Skips duplicate idx (e.g. concurrent inserts) so generateKeyBetween never gets a >= b
  static after(sorted: readonly string[], index: number): string {
    const prevIdx = sorted[index] ?? null;
    const nextIdx =
      sorted
        .slice(index + 1)
        .find((idx) => prevIdx === null || idx > prevIdx) ?? null;
    return generateKeyBetween(prevIdx, nextIdx);
  }

  static getInsertIdx(
    layouts: Record<string, GridLayoutRect>,
    before: { id: string } | null,
  ): string {
    const ordered = R.pipe(
      R.entries(layouts),
      R.sortBy(([, layout]) => layout.idx),
    );
    const sorted = ordered.map(([, layout]) => layout.idx);

    if (before) {
      const index = ordered.findIndex(([id]) => id === before.id);
      if (index > -1) return LayoutIdx.after(sorted, index);
    }

    return LayoutIdx.after(sorted, sorted.length - 1);
  }
}

export class WidgetUtils {
  static getAbsoluteWidth(
    layout: GridLayoutRect,
    columnWidth = COLUMN_WIDTH,
  ): number {
    return layout.isFullWidth
      ? GRID_COLUMNS * columnWidth
      : layout.span * columnWidth;
  }

  static getAbsoluteLeft(
    layout: GridLayoutRect,
    columnWidth = COLUMN_WIDTH,
  ): number {
    return layout.isFullWidth ? 0 : layout.column * columnWidth;
  }
}

export class AbsoluteLayoutUtils {
  static fromGridLayout(
    id: string,
    layout: GridLayoutRect,
    height: number,
    columnWidth = COLUMN_WIDTH,
  ): AbsoluteLayout {
    return {
      id,
      left: WidgetUtils.getAbsoluteLeft(layout, columnWidth),
      top: 0,
      width: WidgetUtils.getAbsoluteWidth(layout, columnWidth),
      height,
      idx: layout.idx,
      isStatic: layout.isStatic,
      isFullWidth: layout.isFullWidth,
    };
  }

  // Overlap depth per axis, relative to the smaller size on that axis (0..1).
  static collisionRatio(a: LayoutRect, b: LayoutRect): CollisionRatio {
    return {
      x: overlapRatio(a.left, a.width, b.left, b.width),
      y: overlapRatio(a.top, a.height, b.top, b.height),
    };
  }

  static isColliding(a: LayoutRect, b: LayoutRect): boolean {
    const { x, y } = AbsoluteLayoutUtils.collisionRatio(a, b);
    return x >= COLLISION_THRESHOLD && y >= COLLISION_THRESHOLD;
  }
}

function overlapRatio(
  startA: number,
  sizeA: number,
  startB: number,
  sizeB: number,
): number {
  const overlap =
    Math.min(startA + sizeA, startB + sizeB) - Math.max(startA, startB);
  const size = Math.min(sizeA, sizeB);
  return overlap > 0 && size > 0 ? overlap / size : 0;
}

export function getColumn(
  layout: LayoutRect,
  columnWidth = COLUMN_WIDTH,
): number {
  return Math.max(
    0,
    Math.min(
      Math.floor(layout.left / columnWidth),
      GRID_COLUMNS - Math.floor(layout.width / columnWidth),
    ),
  );
}

export function getSpan(layout: LayoutRect, columnWidth = COLUMN_WIDTH): number {
  const col = getColumn(layout, columnWidth);
  return Math.max(
    1,
    Math.min(Math.round(layout.width / columnWidth), GRID_COLUMNS - col),
  );
}

export function getColumnRange(
  layout: LayoutRect,
  columnWidth = COLUMN_WIDTH,
): [number, number] {
  const col = getColumn(layout, columnWidth);
  return [col, col + getSpan(layout, columnWidth) - 1];
}

export function getResizeColumn(
  layout: LayoutRect,
  columnWidth = COLUMN_WIDTH,
): number {
  return Math.max(0, Math.floor(layout.left / columnWidth));
}

export function getResizeSpan(
  layout: LayoutRect,
  columnWidth = COLUMN_WIDTH,
): number {
  const col = getResizeColumn(layout, columnWidth);
  return Math.max(
    1,
    Math.min(Math.round(layout.width / columnWidth), GRID_COLUMNS - col),
  );
}

export function setMaxHeight(
  maxHeights: number[],
  layout: LayoutRect,
  columnWidth = COLUMN_WIDTH,
): number[] {
  const [col, right] = getColumnRange(layout, columnWidth);
  for (let i = col; i <= right; i++) {
    maxHeights[i] = Math.max(maxHeights[i], layout.top + layout.height);
  }
  return maxHeights;
}

export function getMaxHeight(
  maxHeights: number[],
  layout: LayoutRect,
  columnWidth = COLUMN_WIDTH,
): number {
  const [col, right] = getColumnRange(layout, columnWidth);
  return Math.max(...maxHeights.slice(col, right + 1));
}
