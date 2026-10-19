import type { BoardColumn, BoardColumnItem, ColumnSize } from "@tomato/types";
import { DEFAULT_COLUMN_SIZE } from "../board.constants";
import type { ColumnDraft } from "../board.types";

export function createColumn(): ColumnDraft {
  return { id: crypto.randomUUID(), type: null, size: DEFAULT_COLUMN_SIZE, label: "", items: {} };
}

export function setColumnItem(column: ColumnDraft, templateId: string, item: BoardColumnItem | null): ColumnDraft {
  const items = { ...column.items };
  if (item) items[templateId] = item;
  else delete items[templateId];
  return { ...column, items };
}

export function isColumnReady(column: ColumnDraft): column is BoardColumn {
  return column.type !== null && column.label.trim().length > 0 && Object.keys(column.items).length > 0;
}

/** Columns without any widget are dropped; `null` when a column that has widgets is still incomplete. */
export function prepareColumns(columns: ColumnDraft[], templateIds: string[]): BoardColumn[] | null {
  const linked = new Set(templateIds);
  const used = columns
    .map((column) => ({
      ...column,
      label: column.label.trim(),
      items: Object.fromEntries(Object.entries(column.items).filter(([id]) => linked.has(id))),
    }))
    .filter((column) => Object.keys(column.items).length > 0);

  return used.every(isColumnReady) ? used : null;
}

export function getColumnSizeStyle(size: ColumnSize): { flex: string } | { width: number; flexShrink: number } {
  return "flex" in size ? { flex: `${size.flex} 1 0%` } : { width: size.width, flexShrink: 0 };
}

export function encodeColumnSize(size: ColumnSize): string {
  return "flex" in size ? `flex:${size.flex}` : `width:${size.width}`;
}

export function decodeColumnSize(encoded: string): ColumnSize {
  const [kind, raw] = encoded.split(":");
  return kind === "flex" ? { flex: Number(raw) } : { width: Number(raw) };
}
