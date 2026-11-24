import { SUBMISSION_DOCUMENT_PREFIX, TEMPLATE_DOCUMENT_PREFIX } from '@tomato/constants';

function buildDocumentName(prefix: string, id: string): string {
  return `${prefix}/${id}`;
}

function parseDocumentName(prefix: string, documentName: string): string | null {
  const [head, id, ...rest] = documentName.split('/');
  if (head !== prefix || !id || rest.length > 0) return null;
  return id;
}

export function buildTemplateDocumentName(templateId: string): string {
  return buildDocumentName(TEMPLATE_DOCUMENT_PREFIX, templateId);
}

export function parseTemplateDocumentName(documentName: string): string | null {
  return parseDocumentName(TEMPLATE_DOCUMENT_PREFIX, documentName);
}

export function buildSubmissionDocumentName(submissionId: string): string {
  return buildDocumentName(SUBMISSION_DOCUMENT_PREFIX, submissionId);
}

export function parseSubmissionDocumentName(documentName: string): string | null {
  return parseDocumentName(SUBMISSION_DOCUMENT_PREFIX, documentName);
}
