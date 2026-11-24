import { Injectable } from '@nestjs/common';
import { SubmissionDocKey, SubmissionDocMetaKey } from '@tomato/constants';
import { getSubmissionDocumentName } from '@tomato/utils';
import { CollabGateway } from '../collab/collab.gateway';

@Injectable()
export class SubmissionValuesService {
  constructor(private readonly collab: CollabGateway) {}

  update(submissionId: string, values: Record<string, unknown>): Promise<void> {
    return this.collab.updateDocument(getSubmissionDocumentName(submissionId), (doc) => {
      const valueMap = doc.getMap<unknown>(SubmissionDocKey.VALUES);
      for (const [widgetId, value] of Object.entries(values)) valueMap.set(widgetId, value);
      doc.getMap<unknown>(SubmissionDocKey.META).set(SubmissionDocMetaKey.UPDATED, Date.now());
    });
  }
}
