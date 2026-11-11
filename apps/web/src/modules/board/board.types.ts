import type { DisplayBucket, DisplayType, ValueType } from "@tomato/constants";
import type { Template } from "@/modules/template-browse";
import type { TemplateVersion } from "@/modules/template-editor";

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

export type SubmissionDisplayValue = Partial<Record<DisplayBucket, unknown>>;

/** widgetId → value property → display buckets */
export type SubmissionDisplayDoc = Record<string, Record<string, SubmissionDisplayValue>>;

export type ColumnDraft = Omit<BoardColumn, "type"> & { type: DisplayType | null };

export interface BoardTemplate {
  templateId: string;
  /** `versions` holds only the newest published version, empty until the template is published. */
  template: Template & { versions: TemplateVersion[] };
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
  _count: { templates: number };
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  boardId: string;
  templateVersionId: string;
  templateVersion: { templateId: string };
  data: Record<string, unknown>;
  dataDisplays: SubmissionDisplayDoc;
  createdAt: string;
  updatedAt: string;
}
