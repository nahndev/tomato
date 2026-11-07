export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

/** Content is drawn at `translate(x, y) scale(scale)` from its top-left corner. */
export interface Transform extends Point {
  scale: number;
}

export interface ImageMapPin extends Point {
  id: string;
  label: string;
}
