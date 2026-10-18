const TOKEN_PATTERN = /\{\{[^{}]*\}\}/g;

export function insertToken(
  text: string,
  cursorPosition: number,
  label: string,
): { text: string; cursorPosition: number } {
  const token = `{{${label}}}`;
  return {
    text: text.slice(0, cursorPosition) + token + text.slice(cursorPosition),
    cursorPosition: cursorPosition + token.length,
  };
}

/** Replaces each `{{...}}` token with a placeholder so the surrounding text can be shape-checked on its own. */
export function stripTokensForValidation(text: string): string {
  return text.replace(TOKEN_PATTERN, "x");
}
