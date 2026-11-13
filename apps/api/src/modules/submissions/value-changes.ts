import { SubmissionDocMetaKey } from '@tomato/constants';
import type { SubmissionClocksEntity, SubmissionValueEntries, SubmissionValueEntry } from './submissions.types';

abstract class EntryChanges {
  private readonly changed = new Map<string, SubmissionValueEntry>();

  protected constructor(
    clocks: Record<string, number>,
    entries: SubmissionValueEntries,
    isKnownKey: (key: string) => boolean,
  ) {
    for (const [key, entry] of Object.entries(entries)) {
      if (isKnownKey(key) && clocks[key] !== entry.clock) this.changed.set(key, entry);
    }
  }

  has(key: string): boolean {
    return this.changed.has(key);
  }

  toEntries(): [string, SubmissionValueEntry][] {
    return [...this.changed.entries()];
  }

  get isEmpty(): boolean {
    return this.changed.size === 0;
  }
}

export class ValueChanges extends EntryChanges {
  constructor(entity: SubmissionClocksEntity, values: SubmissionValueEntries) {
    const { widgets } = entity.templateVersion.snapshot;
    super(entity.dataClocks, values, (widgetId) => widgetId in widgets);
  }
}

export class MetaChanges extends EntryChanges {
  constructor(entity: SubmissionClocksEntity, meta: SubmissionValueEntries) {
    super(entity.metaClocks, meta, (key) => key === SubmissionDocMetaKey.TITLE);
  }
}
