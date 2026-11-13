import { Injectable } from '@nestjs/common';
import { SubmissionDocMetaKey } from '@tomato/constants';
import type { MetaChanges } from './value-changes';
import type { ApplyChangesContext } from './apply-changes-context';

@Injectable()
export class SubmissionMetaService {
  applyMeta(context: ApplyChangesContext, changes: MetaChanges): void {
    for (const [key, { value, clock }] of changes.toEntries()) {
      if (key === SubmissionDocMetaKey.TITLE && typeof value === 'string') context.setTitle(value, clock);
    }
  }
}
