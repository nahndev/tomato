import { TEMPLATE_DOCUMENT_PREFIX } from '@tomato/constants';

export interface TemplateDocumentNameParts {
  templateId: string;
}

export class TemplateDocumentName {
  static format({ templateId }: TemplateDocumentNameParts): string {
    return `${TEMPLATE_DOCUMENT_PREFIX}/${templateId}`;
  }

  static parse(name: string): TemplateDocumentNameParts | null {
    const [prefix, templateId, ...rest] = name.split('/');
    if (prefix !== TEMPLATE_DOCUMENT_PREFIX || !templateId || rest.length > 0) return null;
    return { templateId };
  }
}
