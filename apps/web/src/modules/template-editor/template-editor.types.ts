import type { WidgetType } from "@tomato/constants";
import type { WidgetProperties } from "@/shared/types/template.types";
import type { ComponentType } from "react";

export type WidgetPropertyKey = keyof WidgetProperties;

export interface PropertyFieldProps<K extends WidgetPropertyKey = WidgetPropertyKey> {
  widgetId: string;
  widgetType: WidgetType;
  value: WidgetProperties[K];
  onChange: (value: WidgetProperties[K]) => void;
}

export interface PropertyFieldDefinition {
  label: string;
  Component: ComponentType<PropertyFieldProps>;
}

export type PropertyFieldRegistry = Partial<Record<WidgetPropertyKey, PropertyFieldDefinition>>;

export type WidgetPropertyKeys = Record<WidgetType, WidgetPropertyKey[]>;
