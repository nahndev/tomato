export class JsonBoardTask<TSetting extends { conditions: unknown[] }> {
  constructor(readonly settings: Record<string, TSetting> = {}) {}

  conditionsOf(templateId: string): TSetting['conditions'] | [] {
    return this.settings[templateId]?.conditions ?? [];
  }

  pick(templateIds: Set<string>): JsonBoardTask<TSetting> {
    return new JsonBoardTask(Object.fromEntries(Object.entries(this.settings).filter(([id]) => templateIds.has(id))));
  }
}
