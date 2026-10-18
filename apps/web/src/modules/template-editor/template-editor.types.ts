import type { WidgetGroup, WidgetType } from "@tomato/constants";
import type { GridLayout, Session, Widget, WidgetProperties } from "@tomato/types";
import type { ComponentType } from "react";
import type { EditorIconKey } from "./template-editor.icons";

export interface TemplateState {
  name: string;
  widgets: Record<string, Widget>;
  sessions: Record<string, Session>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
}

export interface FieldComponentProps<TValue = unknown> {
  widget: Widget;
  value?: TValue;
  onChange?: (value: TValue) => void;
}

export interface WidgetItemDefinition {
  type: WidgetType;
  label: string;
  icon: EditorIconKey;
  description: string;
  isDataField: boolean;
  group: WidgetGroup;
  defaultSettings: WidgetProperties;
  defaultLayout: Omit<GridLayout, "idx">;
}

export type WidgetItemRegistry = Record<WidgetType, WidgetItemDefinition>;

export type WidgetComponent<TValue = unknown> = ComponentType<FieldComponentProps<TValue>>;

export type WidgetComponentRegistry = Record<WidgetType, WidgetComponent>;

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
