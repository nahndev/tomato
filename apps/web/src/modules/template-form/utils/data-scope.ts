import { DATA_SCOPE_SEPARATOR } from "../template-form.constants";

/** Flat key a scoped value is stored under; a top-level widget keeps its own id. */
export function toScopedKey(scope: readonly string[]): string {
  return scope.join(DATA_SCOPE_SEPARATOR);
}
