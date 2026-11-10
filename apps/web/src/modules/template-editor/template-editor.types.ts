import type { WidgetType } from "@tomato/constants";
import type { GridLayout, Session, Widget, WidgetProperties } from "@tomato/types";
import type { ComponentType } from "react";

export interface TemplateState {
  name: string;
  widgets: Record<string, Widget>;
  sessions: Record<string, Session>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
}

export type WidgetPropertyKey = keyof WidgetProperties;

export interface WidgetPropertyFieldProps<K extends WidgetPropertyKey = WidgetPropertyKey> {
  widgetId: string;
  widgetType: WidgetType;
  value: WidgetProperties[K];
  onChange: (value: WidgetProperties[K]) => void;
}

export interface WidgetPropertyDescriptor {
  label: string;
  Component: ComponentType<WidgetPropertyFieldProps>;
}

export type WidgetPropertyDescriptorRegistry = Partial<Record<WidgetPropertyKey, WidgetPropertyDescriptor>>;

export type WidgetPropertyRegistry = Record<WidgetType, WidgetPropertyKey[]>;
