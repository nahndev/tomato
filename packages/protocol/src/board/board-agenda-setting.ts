export class BoardAgendaSettings {
  static pick<TSetting>(setting: Record<string, TSetting>, templateIds: Set<string>): Record<string, TSetting> {
    return Object.fromEntries(Object.entries(setting).filter(([id]) => templateIds.has(id)));
  }
}
