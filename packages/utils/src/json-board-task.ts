export class JsonBoardTask<TSetting extends { conditions: unknown[] }> {
  constructor(readonly setting: Record<string, TSetting> = {}) {}

  conditionsOf(templateId: string): TSetting['conditions'] | [] {
    return this.setting[templateId]?.conditions ?? [];
  }

  pick(templateIds: Set<string>): JsonBoardTask<TSetting> {
    return new JsonBoardTask(Object.fromEntries(Object.entries(this.setting).filter(([id]) => templateIds.has(id))));
  }
}
