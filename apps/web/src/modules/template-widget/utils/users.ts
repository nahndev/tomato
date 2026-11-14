export function toUserIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((id): id is string => typeof id === "string" && id !== "");
  return typeof value === "string" && value ? [value] : [];
}
