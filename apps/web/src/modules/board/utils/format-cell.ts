import { DisplayType } from "@tomato/constants";
import type { BoardColumn } from "../board.types";
import type { Submission } from "../board.types";
import { EMPTY_CELL } from "../board.constants";
import { parseLabel, parseNumber, parseTimestamp } from "./display-value";

const FORMATTERS: Record<DisplayType, (value: Parameters<typeof parseLabel>[0]) => string | null> = {
  [DisplayType.TEXT]: parseLabel,
  [DisplayType.NUMBER]: (value) => parseNumber(value)?.toLocaleString() ?? null,
  [DisplayType.DATE]: (value) => formatTimestamp(parseTimestamp(value), (date) => date.toLocaleDateString()),
  [DisplayType.TIME]: (value) => formatTimestamp(parseTimestamp(value), (date) => date.toLocaleTimeString()),
  [DisplayType.DATETIME]: (value) => formatTimestamp(parseTimestamp(value), (date) => date.toLocaleString()),
};

function formatTimestamp(timestamp: number | null, format: (date: Date) => string): string | null {
  return timestamp === null ? null : format(new Date(timestamp));
}

export function formatCell(column: BoardColumn, submission: Submission): string {
  const item = column.items[submission.templateVersion.templateId];
  if (!item) return EMPTY_CELL;
  return FORMATTERS[column.type](submission.dataDisplays[item.widgetId]?.[item.property]) ?? EMPTY_CELL;
}
