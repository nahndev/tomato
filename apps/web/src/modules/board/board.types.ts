import type { DisplayBucket, DisplayType, ValueType } from "@tomato/constants";
import type { Template, TemplateVersion } from "@/shared/types/template.types";

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

export interface BoardTemplate {
  templateId: string;
  /** `versions` holds only the newest published version, empty until the template is published. */
  template: Template & { versions: TemplateVersion[] };
}

export interface BoardTable {
  boardId: string;
  columns: BoardColumn[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardTask {
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardAgenda {
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  templates: BoardTemplate[];
  table: BoardTable | null;
  task: BoardTask | null;
  agenda: BoardAgenda | null;
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
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionValues = Pick<Submission, "id" | "boardId" | "data" | "dataDisplays" | "title" | "updatedAt">;
