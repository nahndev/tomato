import { ValueType } from '@tomato/constants';
import { isUUID } from 'class-validator';
import { createValidator, isRecord } from '../../../common';
import { BOARD_COLUMN_MAX_SIZE } from '../boards.constants';

const VALUE_TYPES: readonly string[] = Object.values(ValueType);

function isColumnSize(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const entries = Object.entries(value);
  if (entries.length !== 1) return false;
  const [[key, size]] = entries;
  return (
    (key === 'width' || key === 'flex') &&
    typeof size === 'number' &&
    Number.isInteger(size) &&
    size >= 1 &&
    size <= BOARD_COLUMN_MAX_SIZE
  );
}

function isColumnItems(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(([templateId, item]) => {
    if (!isUUID(templateId) || !isRecord(item)) return false;
    const { widgetId, property, ...rest } = item;
    return (
      Object.keys(rest).length === 0 &&
      typeof widgetId === 'string' &&
      widgetId.length > 0 &&
      typeof property === 'string' &&
      VALUE_TYPES.includes(property)
    );
  });
}

/** `{ width: n }` or `{ flex: n }`, a positive integer. */
export const IsColumnSize = createValidator('isColumnSize', isColumnSize);

/** `templateId → { widgetId, property }`. */
export const IsColumnItems = createValidator('isColumnItems', isColumnItems);
