import { Injectable } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import { parseSubmissionDocumentName, parseTemplateDocumentName } from '@tomato/utils';
import * as Y from 'yjs';
import { z } from 'zod';
import { StorageService } from '../storage/storage.service';

const documentIdSchema = z.uuid();

@Injectable()
export class CollabService {
  constructor(private readonly storage: StorageService) {}

  async load(documentName: string): Promise<Y.Doc> {
    const doc = new Y.Doc();
    const state = await this.storage.load(this.getPath(documentName));
    if (state) Y.applyUpdate(doc, state);
    return doc;
  }

  async save(documentName: string, doc: Y.Doc): Promise<void> {
    await this.storage.save(this.getPath(documentName), Y.encodeStateAsUpdate(doc));
  }

  private getPath(documentName: string): string {
    const id = parseTemplateDocumentName(documentName) ?? parseSubmissionDocumentName(documentName);
    if (!id || !documentIdSchema.safeParse(id).success) {
      throw new Error(ErrorCode.VALIDATION_FAILED);
    }
    return documentName;
  }
}
