export interface Template {
  id: string;
  name: string;
  description: string | null;
  previewImageUrl: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}
