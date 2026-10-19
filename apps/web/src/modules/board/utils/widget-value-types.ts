import type { DisplayType, ValueType, WidgetType } from "@tomato/constants";
import { WIDGET_VALUE_TYPES } from "../constants/widget-value-types.constants";

export function getValueTypes(type: WidgetType): ValueType[] {
  return Object.keys(WIDGET_VALUE_TYPES[type]) as ValueType[];
}

export function getValueTypeDisplayTypes(type: WidgetType, valueType: ValueType): DisplayType[] {
  return WIDGET_VALUE_TYPES[type][valueType] ?? [];
}

/** Display types shared by every entry, or `null` (no constraint yet) when there are none. */
export function getCommonDisplayTypes(
  entries: { widgetType: WidgetType; property: ValueType }[],
): DisplayType[] | null {
  if (entries.length === 0) return null;
  return entries
    .map(({ widgetType, property }) => getValueTypeDisplayTypes(widgetType, property))
    .reduce((common, types) => common.filter((type) => types.includes(type)));
}
