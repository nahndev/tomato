import { DATA_SCOPE_SEPARATOR } from "../template-data.constants";

/** Flat key a scoped value is stored under; a top-level widget keeps its own id. */
export function toScopedKey(scope: readonly string[]): string {
  return scope.join(DATA_SCOPE_SEPARATOR);
}

/** The value of `widgetId` seen from `scope`: the innermost enclosing scope that holds it wins. */
export function readScopedValue(
  values: Record<string, unknown>,
  scope: readonly string[],
  widgetId: string,
): unknown {
  for (let depth = scope.length; depth >= 0; depth--) {
    const value = values[toScopedKey([...scope.slice(0, depth), widgetId])];
    if (value !== undefined) return value;
  }
  return undefined;
}
