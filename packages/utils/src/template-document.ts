import { TEMPLATE_DOCUMENT_PREFIX } from '@tomato/constants';

export function getTemplateDocumentName(templateId: string): string {
  return `${TEMPLATE_DOCUMENT_PREFIX}/${templateId}`;
}

export function parseTemplateDocumentName(documentName: string): string | null {
  const [prefix, templateId, ...rest] = documentName.split('/');
  if (prefix !== TEMPLATE_DOCUMENT_PREFIX || !templateId || rest.length > 0) return null;
  return templateId;
}
