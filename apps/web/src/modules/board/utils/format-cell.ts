import { DisplayType } from "@tomato/constants";
import type { BoardColumn, Submission } from "@tomato/types";
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

/** What a column shows for a submission: the widget picked for the submission's template. */
export function formatCell(column: BoardColumn, submission: Submission): string {
  const item = column.items[submission.templateId];
  if (!item) return EMPTY_CELL;
  return FORMATTERS[column.type](submission.dataDisplays[item.widgetId]?.[item.property]) ?? EMPTY_CELL;
}
