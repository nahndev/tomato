import { Injectable, Logger } from '@nestjs/common';
import { SubmissionDocKey } from '@tomato/constants';
import type { SubmissionValueEntries } from '@tomato/types';
import { parseSubmissionDocumentName } from '@tomato/utils';
import type * as Y from 'yjs';
import { SubmissionApiClient } from './submission-api.client';

/** The Yjs item behind a map key; its clock changes every time the key is written. */
interface YMapInternals {
  _map: Map<string, { id: { clock: number } }>;
}

export function extractValues(doc: Y.Doc): SubmissionValueEntries {
  const map = doc.getMap<unknown>(SubmissionDocKey.VALUES);
  const { _map: items } = map as unknown as YMapInternals;
  const entries: SubmissionValueEntries = {};
  for (const key of map.keys()) {
    const item = items.get(key);
    if (item) entries[key] = { value: map.get(key), clock: item.id.clock };
  }
  return entries;
}

@Injectable()
export class SubmissionService {
  private readonly logger = new Logger(SubmissionService.name);

  constructor(private readonly apiClient: SubmissionApiClient) {}

  /** Pushes the live values of a submission document to the api; any other document is ignored. */
  async sync(documentName: string, doc: Y.Doc): Promise<void> {
    const submissionId = parseSubmissionDocumentName(documentName);
    if (!submissionId) return;

    const values = extractValues(doc);
    if (Object.keys(values).length === 0) return;

    try {
      await this.apiClient.putValues(submissionId, values);
    } catch (error) {
      this.logger.warn(`Could not sync submission ${submissionId}: ${(error as Error).message}`);
    }
  }
}
