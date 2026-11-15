import type { ColumnSize } from "../board.types";

export function getColumnSizeStyle(size: ColumnSize): { flex: string } | { width: number; flexShrink: number } {
  return "flex" in size ? { flex: `${size.flex} 1 0%` } : { width: size.width, flexShrink: 0 };
}
