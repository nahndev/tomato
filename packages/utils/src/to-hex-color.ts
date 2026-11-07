import Color from 'color';

export function toHexColor(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    return Color(value).hex().toLowerCase();
  } catch {
    return null;
  }
}
