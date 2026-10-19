import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server } from '@hocuspocus/server';
import { ErrorCode } from '@tomato/constants';
import type * as Y from 'yjs';
import type { Env } from '../../config.schema';
import { DOCUMENT_STORE_DEBOUNCE_MS, DOCUMENT_STORE_MAX_DEBOUNCE_MS } from './collab.constants';
import { SubmissionService } from '../submission/submission.service';
import { CollabService } from './collab.service';

@Injectable()
export class CollabGateway implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly server: Server;

  constructor(
    private readonly collabService: CollabService,
    private readonly submissionService: SubmissionService,
    private readonly config: ConfigService<Env, true>,
  ) {
    this.server = new Server({
      quiet: true,
      stopOnSignals: false,
      debounce: DOCUMENT_STORE_DEBOUNCE_MS,
      maxDebounce: DOCUMENT_STORE_MAX_DEBOUNCE_MS,
      onLoadDocument: ({ documentName }) => this.collabService.load(documentName),
      onStoreDocument: async ({ documentName, document }) => {
        await this.collabService.save(documentName, document);
        await this.submissionService.sync(documentName, document);
      },
    });
  }

  async onApplicationBootstrap() {
    await this.server.listen(this.config.get('COLLAB_WS_PORT', { infer: true }));
  }

  async readDocument<T>(documentName: string, read: (doc: Y.Doc) => T): Promise<T> {
    const connection = await this.server.hocuspocus.openDirectConnection(documentName);
    try {
      if (!connection.document) throw new Error(ErrorCode.INTERNAL_ERROR);
      return read(connection.document);
    } finally {
      await connection.disconnect();
    }
  }

  onModuleDestroy() {
    return this.server.destroy();
  }
}
