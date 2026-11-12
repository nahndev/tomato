import { Injectable } from '@nestjs/common';
import type { ValueChanges } from './value-changes';
import type { ApplyChangesContext } from './apply-changes-context';

@Injectable()
export class SubmissionValuesService {
  applyValues(context: ApplyChangesContext, changes: ValueChanges): void {
    for (const [widgetId, { value, clock }] of changes.toEntries()) context.setValue(widgetId, value, clock);
  }
}
