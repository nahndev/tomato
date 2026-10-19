import { Injectable } from '@nestjs/common';
import { TemplateDocKey } from '@tomato/constants';
import type { GridLayout, Session, TemplateSnapshot, Widget } from '@tomato/types';
import { getTemplateDocumentName } from '@tomato/utils';
import type * as Y from 'yjs';
import { CollabGateway } from '../collab/collab.gateway';

export function toTemplateSnapshot(doc: Y.Doc): TemplateSnapshot {
  return {
    name: doc.getText(TemplateDocKey.NAME).toString(),
    widgets: doc.getMap<Widget>(TemplateDocKey.WIDGETS).toJSON(),
    sessions: doc.getMap<Session>(TemplateDocKey.SESSIONS).toJSON(),
    layouts: doc.getMap<GridLayout>(TemplateDocKey.LAYOUTS).toJSON(),
    widgetToSession: doc.getMap<string>(TemplateDocKey.WIDGET_TO_SESSION).toJSON(),
  };
}

@Injectable()
export class TemplateService {
  constructor(private readonly collabGateway: CollabGateway) {}

  getSnapshot(templateId: string): Promise<TemplateSnapshot> {
    return this.collabGateway.readDocument(getTemplateDocumentName(templateId), toTemplateSnapshot);
  }
}
