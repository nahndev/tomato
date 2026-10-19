import type { DisplayType, ValueType } from '@tomato/constants';
import type { TemplateVersion } from './template-editor.types';

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumnItem {
  widgetId: string;
  property: ValueType;
}

export interface BoardColumn {
  id: string;
  type: DisplayType;
  size: ColumnSize;
  label: string;
  /** templateId → the widget (and value property) shown for that template */
  items: Record<string, BoardColumnItem>;
}

export interface BoardTemplate {
  id: string;
  name: string;
  /** Newest published version; its snapshot tells which widgets can fill a column. `null` until the template is published. */
  latestVersion: TemplateVersion | null;
}

export interface Board {
  id: string;
  name: string;
  columns: BoardColumn[];
  templates: BoardTemplate[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardSummary {
  id: string;
  name: string;
  templateCount: number;
  createdAt: string;
  updatedAt: string;
}
