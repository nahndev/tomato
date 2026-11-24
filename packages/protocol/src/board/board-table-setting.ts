export class BoardTableSettings {
  static referencesOnly<TColumn extends { items: Record<string, unknown> }>(
    setting: TColumn[],
    templateIds: Set<string>,
  ): boolean {
    return setting.every((column) => Object.keys(column.items).every((id) => templateIds.has(id)));
  }

  static pick<TColumn extends { items: Record<string, unknown> }>(setting: TColumn[], templateIds: Set<string>): TColumn[] {
    return setting.map((column) => ({
      ...column,
      items: Object.fromEntries(Object.entries(column.items).filter(([id]) => templateIds.has(id))),
    }));
  }
}
