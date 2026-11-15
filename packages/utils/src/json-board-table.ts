export class JsonBoardTable<TColumn extends { items: Record<string, unknown> }> {
  constructor(readonly setting: TColumn[] = []) {}

  referencesOnly(templateIds: Set<string>): boolean {
    return this.setting.every((column) => Object.keys(column.items).every((id) => templateIds.has(id)));
  }

  pick(templateIds: Set<string>): JsonBoardTable<TColumn> {
    return new JsonBoardTable(
      this.setting.map((column) => ({
        ...column,
        items: Object.fromEntries(Object.entries(column.items).filter(([id]) => templateIds.has(id))),
      })),
    );
  }
}
