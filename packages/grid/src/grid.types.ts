export const GridDndType = {
  WIDGET: '@grid/widget',
} as const;
export type GridDndType = (typeof GridDndType)[keyof typeof GridDndType];

export interface LayoutRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface GridLayoutRect {
  column: number;
  span: number;
  idx: string;
  isStatic?: boolean;
  isFullWidth?: boolean;
}

export interface AbsoluteLayout extends LayoutRect {
  id: string;
  idx: string;
  isStatic?: boolean;
  isFullWidth?: boolean;
}

export interface MovingLayout extends LayoutRect {
  id: string;
}

export interface ContainerOptions {
  isGridVisible?: boolean;
}
