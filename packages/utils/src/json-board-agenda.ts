export class JsonBoardAgenda<TSetting> {
  constructor(readonly setting: Record<string, TSetting> = {}) {}

  pick(templateIds: Set<string>): JsonBoardAgenda<TSetting> {
    return new JsonBoardAgenda(Object.fromEntries(Object.entries(this.setting).filter(([id]) => templateIds.has(id))));
  }
}
