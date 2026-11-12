import type { SubmissionClocksEntity, SubmissionValueEntries, SubmissionValueEntry } from './submissions.types';

export class ValueChanges {
  private readonly changed = new Map<string, SubmissionValueEntry>();

  constructor(entity: SubmissionClocksEntity, values: SubmissionValueEntries) {
    const { widgets } = entity.templateVersion.snapshot;
    for (const [widgetId, entry] of Object.entries(values)) {
      if (widgetId in widgets && entity.dataClocks[widgetId] !== entry.clock) this.changed.set(widgetId, entry);
    }
  }

  has(widgetId: string): boolean {
    return this.changed.has(widgetId);
  }

  toEntries(): [string, SubmissionValueEntry][] {
    return [...this.changed.entries()];
  }

  get isEmpty(): boolean {
    return this.changed.size === 0;
  }
}
