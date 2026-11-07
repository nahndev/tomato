import { GroupType } from '@tomato/constants';
import { ValidateBy, buildMessage, isUUID } from 'class-validator';
import { GROUP_LIMIT_MAX_DEPTH } from '../groups.constants';

type ValueGuard = (value: unknown) => boolean;

const GROUP_TYPES: readonly unknown[] = Object.values(GroupType);

const isGroupType: ValueGuard = (value) => GROUP_TYPES.includes(value);
const isUuid: ValueGuard = (value) => isUUID(value);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFieldFilter(filter: unknown, isValue: ValueGuard): boolean {
  if (isValue(filter)) return true;
  if (!isRecord(filter)) return false;
  return Object.entries(filter).every(([operator, operand]) => {
    if (operator === 'equals' || operator === 'not') return isValue(operand);
    if (operator === 'in' || operator === 'notIn') {
      return Array.isArray(operand) && operand.every(isValue);
    }
    return false;
  });
}

export function isGroupLimit(limit: unknown, depth = 1): boolean {
  if (depth > GROUP_LIMIT_MAX_DEPTH || !isRecord(limit)) return false;
  const isNested = (value: unknown) => isGroupLimit(value, depth + 1);
  return Object.entries(limit).every(([key, value]) => {
    switch (key) {
      case 'type':
        return isFieldFilter(value, isGroupType);
      case 'uuid':
        return isFieldFilter(value, isUuid);
      case 'OR':
        return Array.isArray(value) && value.every(isNested);
      case 'AND':
      case 'NOT':
        return Array.isArray(value) ? value.every(isNested) : isNested(value);
      default:
        return false;
    }
  });
}

export const IsGroupLimit = () =>
  ValidateBy({
    name: 'isGroupLimit',
    validator: {
      validate: (value: unknown) => isGroupLimit(value),
      defaultMessage: buildMessage((prefix) => `${prefix}$property must be a valid group filter`),
    },
  });
