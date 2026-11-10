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
  static getInsertIdx(
    layouts: Record<string, GridLayoutRect>,
    before: { id: string } | null,
  ): string {
    const ordered = R.pipe(
      R.entries(layouts),
      R.sortBy(([, layout]) => layout.idx),
    );

    if (before) {
      const index = ordered.findIndex(([id]) => id === before.id);
      const [, { idx: prevIdx }] = ordered[index] ?? [null, { idx: null }];
      const [, { idx: nextIdx }] = ordered[index + 1] ?? [null, { idx: null }];
      return generateKeyBetween(prevIdx, nextIdx);
    }

    return generateKeyBetween(R.last(ordered)?.[1].idx ?? null, null);
  }
}

export class WidgetUtils {
  static getAbsoluteWidth(layout: GridLayoutRect): number {
    return layout.isFullWidth
      ? GRID_COLUMNS * COLUMN_WIDTH
      : layout.span * COLUMN_WIDTH;
  }

  static getAbsoluteLeft(layout: GridLayoutRect): number {
    return layout.isFullWidth ? 0 : layout.column * COLUMN_WIDTH;
  }
}

export class AbsoluteLayoutUtils {
  static fromGridLayout(
    id: string,
    layout: GridLayoutRect,
    height: number,
  ): AbsoluteLayout {
    return {
      id,
      left: WidgetUtils.getAbsoluteLeft(layout),
      top: 0,
      width: WidgetUtils.getAbsoluteWidth(layout),
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

export function getColumn(layout: LayoutRect): number {
  return Math.max(
    0,
    Math.min(
      Math.floor(layout.left / COLUMN_WIDTH),
      GRID_COLUMNS - Math.floor(layout.width / COLUMN_WIDTH),
    ),
  );
}

export function getSpan(layout: LayoutRect): number {
  const col = getColumn(layout);
  return Math.max(
    1,
    Math.min(Math.round(layout.width / COLUMN_WIDTH), GRID_COLUMNS - col),
  );
}

export function getColumnRange(layout: LayoutRect): [number, number] {
  const col = getColumn(layout);
  return [col, col + getSpan(layout) - 1];
}

export function getResizeColumn(layout: LayoutRect): number {
  return Math.max(0, Math.floor(layout.left / COLUMN_WIDTH));
}

export function getResizeSpan(layout: LayoutRect): number {
  const col = getResizeColumn(layout);
  return Math.max(
    1,
    Math.min(Math.round(layout.width / COLUMN_WIDTH), GRID_COLUMNS - col),
  );
}

export function setMaxHeight(
  maxHeights: number[],
  layout: LayoutRect,
): number[] {
  const [col, right] = getColumnRange(layout);
  for (let i = col; i <= right; i++) {
    maxHeights[i] = Math.max(maxHeights[i], layout.top + layout.height);
  }
  return maxHeights;
}

export function getMaxHeight(maxHeights: number[], layout: LayoutRect): number {
  const [col, right] = getColumnRange(layout);
  return Math.max(...maxHeights.slice(col, right + 1));
}
