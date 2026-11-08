/** `undefined` when there are no colors. */
export function pickRandomColor(colors: readonly string[]): string | undefined {
  return colors[Math.floor(Math.random() * colors.length)];
}
