import { INITIAL_TEMPLATE_VERSION } from './template-editor.constants';

const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/;

export function getNextVersion(latest: string | null): string {
  const match = latest ? VERSION_PATTERN.exec(latest) : null;
  if (!match) return INITIAL_TEMPLATE_VERSION;
  return `${match[1]}.${Number(match[2]) + 1}.0`;
}
