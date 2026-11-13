import type { WidgetGroup, WidgetType } from "@tomato/constants";
import type { GridLayout, Widget, WidgetProperties } from "@/shared/types/template.types";
import type { ComponentType } from "react";
import type { ReferStepStatus } from "./template-widget.constants";
import type { EditorIconKey } from "./template-widget.icons";

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

export interface ReferStep {
  userId: string;
  idempotencyKey: string;
  status: ReferStepStatus;
  /** The submission the dependency points to, once it exists. */
  targetId?: string;
}

export interface ViewTab {
  id: string;
  name: string;
}

export type WidgetItemRegistry = Record<WidgetType, WidgetItemDefinition>;

export type FieldComponent<TValue = unknown> = ComponentType<FieldComponentProps<TValue>>;

export type WidgetComponentRegistry = Record<WidgetType, FieldComponent>;
